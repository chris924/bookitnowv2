package com.bookitnowv2.appointment_booking.elasticSearch.config;

import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.ssl.SSLContexts;
import org.elasticsearch.client.RestClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

import javax.net.ssl.SSLContext;
import java.io.File;

@Configuration
public class HttpClientConfig implements RestClientBuilder.HttpClientConfigCallback {


    private final String elasticPass;
    private final String elasticTrustStorePath;

    @Autowired
    public HttpClientConfig(@Value("${elastic.password}") String elasticPass, @Value("${elastic.truststore.path}") String elasticTrustStorePath) {
        this.elasticPass = elasticPass;
        this.elasticTrustStorePath = elasticTrustStorePath;
    }

    @Override
    public HttpAsyncClientBuilder customizeHttpClient(HttpAsyncClientBuilder httpClientBuilder) {
        try {
            final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
            UsernamePasswordCredentials usernamePasswordCredentials = new UsernamePasswordCredentials("elastic",
                    elasticPass);
            credentialsProvider.setCredentials(AuthScope.ANY, usernamePasswordCredentials);
            httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);

            File trustLocationFile = new File(elasticTrustStorePath);

            SSLContextBuilder sslContextBuilder = SSLContexts.custom().loadTrustMaterial(trustLocationFile,
                    elasticPass.toCharArray());
            SSLContext sslContext = sslContextBuilder.build();
            httpClientBuilder.setSSLContext(sslContext);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return httpClientBuilder;
    }

}
