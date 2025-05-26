package com.bookitnowv2.appointment_booking.elasticSearch.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ESClient {

    @Value("${elastic.password}")
    private String elasticPass;

    @Value("${elastic.truststore.path}")
    private String elasticTrustStorePath;

    @Bean
    public ElasticsearchClient getElasticsearchClient() {
        RestClientBuilder builder = RestClient.builder(new HttpHost("localhost", 9200, "https"));

        RestClientBuilder.HttpClientConfigCallback httpClientConfigCallback = new HttpClientConfig(elasticPass, elasticTrustStorePath);
        builder.setHttpClientConfigCallback(httpClientConfigCallback);

        RestClient restClient = builder.build();

        RestClientTransport restClientTransport = new RestClientTransport(restClient, new JacksonJsonpMapper());

        return new ElasticsearchClient(restClientTransport);
    }
}
