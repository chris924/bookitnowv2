package com.bookitnowv2.appointment_booking.configuration;

import com.bookitnowv2.appointment_booking.entity.User;
import com.bookitnowv2.appointment_booking.entity.dto.company.CompanyGetResponseDTO;
import com.bookitnowv2.appointment_booking.service.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

//This component is responsible, to check if the JWT token is valid from the cookie
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserAuthService userAuthService;
    private final UserService userService;
    private final CompanyAuthService companyAuthService;
    private final CompanyService companyService;


    public JwtAuthFilter(TokenService tokenService, UserAuthService userAuthService, UserService userService, CompanyAuthService companyAuthService, CompanyService companyService)
    {
        this.tokenService = tokenService;
        this.userAuthService = userAuthService;
        this.userService = userService;
        this.companyAuthService = companyAuthService;
        this.companyService = companyService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String jwt = null;

        if(request.getCookies() != null){
            for (Cookie cookie : request.getCookies())
            {
                if("jwt".equals(cookie.getName()))
                {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null)
        {

            Jwt decodedJwt = tokenService.decodeJwt(jwt);

            String id = decodedJwt.getSubject();

            String type = decodedJwt.getClaim("roles");

            if("USER".equals(type))
            {
                User foundUser = userService.getUserById(Integer.parseInt(id));

                UserDetails userDetails = userAuthService.loadUserByUsername(foundUser.getEmail());

                if (tokenService.isTokenValid(decodedJwt)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            else if("COMPANY".equals(type))
            {
                CompanyGetResponseDTO foundCompany = companyService.getCompanyById(Integer.parseInt(id));

                UserDetails userDetails = companyAuthService.loadUserByUsername(foundCompany.email);

                if (tokenService.isTokenValid(decodedJwt)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

}
