package com.bookitnowv2.appointment_booking.elasticSearch.document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class EmployeeDocument {

    @Id
    private Long id;

    private String name;
    private String company;
    private String companyAvatarUrl;
    private Double companyRating;
    private String place;
    private String avatarUrl;
    private String about;
    private Double rating;
}
