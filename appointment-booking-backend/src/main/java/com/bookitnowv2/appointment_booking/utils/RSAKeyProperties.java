package com.bookitnowv2.appointment_booking.utils;

import lombok.Getter;
import org.springframework.stereotype.Component;
import java.io.InputStream;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Getter
@Component
public class RSAKeyProperties {

    private final RSAPublicKey publicKey;
    private final RSAPrivateKey privateKey;

    public RSAKeyProperties() throws Exception {
        this.publicKey = loadPublicKey();
        this.privateKey = loadPrivateKey();
    }

    private RSAPublicKey loadPublicKey() throws Exception {
        try (InputStream inputStream = getClass().getResourceAsStream("/keys/public.pem")) {
            String key = null;
            if (inputStream != null) {
                key = new String(inputStream.readAllBytes())
                        .replaceAll("-----BEGIN PUBLIC KEY-----", "")
                        .replaceAll("-----END PUBLIC KEY-----", "")
                        .replaceAll("\\s", "");
            }
            byte[] decoded = Base64.getDecoder().decode(key);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
            return (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(spec);
        }
    }

    private RSAPrivateKey loadPrivateKey() throws Exception {
        try (InputStream inputStream = getClass().getResourceAsStream("/keys/private.pem")) {
            String key = null;
            if (inputStream != null) {
                key = new String(inputStream.readAllBytes())
                        .replaceAll("-----BEGIN PRIVATE KEY-----", "")
                        .replaceAll("-----END PRIVATE KEY-----", "")
                        .replaceAll("\\s", "");
            }
            byte[] decoded = Base64.getDecoder().decode(key);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
            return (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(spec);
        }
    }

}
