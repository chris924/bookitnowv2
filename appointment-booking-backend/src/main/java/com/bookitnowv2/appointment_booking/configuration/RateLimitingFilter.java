package com.bookitnowv2.appointment_booking.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple in-memory fixed-window rate limiter that protects the authentication
 * endpoints (POST /auth/**) from brute-force / credential-stuffing attacks.
 *
 * Registered automatically as a servlet filter (it is a {@link Component}), so it
 * runs before the Spring Security filter chain. State is per-instance, which is
 * sufficient for a single backend container; a multi-instance deployment should
 * move this to a shared store (e.g. Redis / Bucket4j).
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final int maxRequests;
    private final long windowMillis;

    private final ConcurrentHashMap<String, Window> buckets = new ConcurrentHashMap<>();

    public RateLimitingFilter(
            @Value("${app.rate-limit.auth.max-requests:10}") int maxRequests,
            @Value("${app.rate-limit.auth.window-seconds:60}") long windowSeconds
    ) {
        this.maxRequests = maxRequests;
        this.windowMillis = windowSeconds * 1000L;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Only throttle write operations against the auth endpoints.
        return !("POST".equalsIgnoreCase(request.getMethod())
                && request.getRequestURI().startsWith("/auth/"));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String clientKey = clientIp(request);
        long now = System.currentTimeMillis();

        Window window = buckets.compute(clientKey, (key, existing) -> {
            if (existing == null || now - existing.windowStart >= windowMillis) {
                return new Window(now);
            }
            return existing;
        });

        int count = window.count.incrementAndGet();
        if (count > maxRequests) {
            long retryAfterSeconds = Math.max(1, (windowMillis - (now - window.windowStart)) / 1000);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
            response.getWriter().write("Too many requests. Please try again later.");
            return;
        }

        // Opportunistic cleanup to keep the map from growing unbounded.
        if (buckets.size() > 10_000) {
            buckets.values().removeIf(w -> now - w.windowStart >= windowMillis);
        }

        filterChain.doFilter(request, response);
    }

    private String clientIp(HttpServletRequest request) {
        // Behind nginx the real client is in X-Forwarded-For (first entry).
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static final class Window {
        final long windowStart;
        final AtomicInteger count = new AtomicInteger(0);

        Window(long windowStart) {
            this.windowStart = windowStart;
        }
    }
}
