package com.bookitnowv2.appointment_booking.utils;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import java.io.InputStream;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Slf4j
@Getter
@Component
public class RSAKeyProperties {

    private final RSAPublicKey publicKey;
    private final RSAPrivateKey privateKey;

    // Key locations are Spring resource strings, so both "classpath:" and "file:" work.
    public RSAKeyProperties(
            ResourceLoader resourceLoader,
            @Value("${app.keys.public-location:classpath:keys/public.pem}") String publicKeyLocation,
            @Value("${app.keys.private-location:classpath:keys/private.pem}") String privateKeyLocation
    ) throws Exception {
        boolean keysPresent = resourceLoader.getResource(publicKeyLocation).exists()
                && resourceLoader.getResource(privateKeyLocation).exists();

        // A fresh checkout has no key files (they are git-ignored), so fall back to an
        // in-memory keypair.
        if (!keysPresent) {
            log.warn("No RSA key files at {} / {}; using a temporary in-memory keypair. "
                    + "Issued JWTs become invalid when the backend restarts.", publicKeyLocation, privateKeyLocation);
            KeyPair keyPair = KeyGeneratorUtility.GenerateRsaKey();
            this.publicKey = (RSAPublicKey) keyPair.getPublic();
            this.privateKey = (RSAPrivateKey) keyPair.getPrivate();
            return;
        }

        this.publicKey = loadPublicKey(resourceLoader, publicKeyLocation);
        this.privateKey = loadPrivateKey(resourceLoader, privateKeyLocation);
    }

    private RSAPublicKey loadPublicKey(ResourceLoader resourceLoader, String location) throws Exception {
        try (InputStream inputStream = resourceLoader.getResource(location).getInputStream()) {
            String key = new String(inputStream.readAllBytes())
                    .replaceAll("-----BEGIN PUBLIC KEY-----", "")
                    .replaceAll("-----END PUBLIC KEY-----", "")
                    .replaceAll("\\s", "");
            byte[] decoded = Base64.getDecoder().decode(key);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
            return (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(spec);
        }
    }

    private RSAPrivateKey loadPrivateKey(ResourceLoader resourceLoader, String location) throws Exception {
        try (InputStream inputStream = resourceLoader.getResource(location).getInputStream()) {
            String key = new String(inputStream.readAllBytes())
                    .replaceAll("-----BEGIN PRIVATE KEY-----", "")
                    .replaceAll("-----END PRIVATE KEY-----", "")
                    .replaceAll("\\s", "");
            byte[] decoded = Base64.getDecoder().decode(key);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
            return (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(spec);
        }
    }

}
