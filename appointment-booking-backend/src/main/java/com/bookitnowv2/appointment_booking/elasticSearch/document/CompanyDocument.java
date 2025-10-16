package com.bookitnowv2.appointment_booking.elasticSearch.document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;

@AllArgsConstructor
@Getter
@Setter
@Document(indexName = "companies")
public class CompanyDocument{
    private Long id;
    private String name;
}
