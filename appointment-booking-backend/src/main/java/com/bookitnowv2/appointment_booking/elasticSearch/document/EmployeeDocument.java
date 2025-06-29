package com.bookitnowv2.appointment_booking.elasticSearch.document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Document(indexName = "employees")
public class EmployeeDocument {

    @Id
    private Integer id;

    private String name;
    private String company;
    private String place;
    private String avatarUrl;
    private Double rating;
}
