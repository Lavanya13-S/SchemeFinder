# Requirements Document: SchemeFinder - Government Scheme Discovery Platform

## Introduction

SchemeFinder is a web-based platform that helps Indian citizens discover and check eligibility for 3000+ government schemes across India. The system aggregates scheme data from various government sources, provides intelligent search and filtering capabilities, evaluates user eligibility through a rule-based engine, and allows authenticated users to save schemes for future reference.

## Glossary

- **System**: The SchemeFinder web application including frontend, backend, and data processing components
- **User**: A citizen of India seeking information about government schemes
- **Scheme**: A government welfare program with specific eligibility criteria and benefits
- **Eligibility_Engine**: The rule-based component that evaluates user eligibility for schemes
- **Search_Service**: The component that handles full-text search queries across schemes
- **Filter_Service**: The component that applies multi-dimensional filters to scheme data
- **Auth_Service**: The authentication and authorization component using Supabase
- **Data_Pipeline**: The Python-based ETL pipeline for ingesting and processing scheme data
- **Scheme_Repository**: The PostgreSQL database storing scheme information
- **User_Dashboard**: The authenticated user interface for managing saved schemes
- **Eligibility_Form**: The 6-step form collecting user information for eligibility checking
- **Constraint**: A specific eligibility requirement (age, income, state, etc.) for a scheme
- **Debounce_Interval**: The 300ms delay before executing search queries

## Requirements

### Requirement 1: Scheme Data Aggregation and Storage

**User Story:** As a system administrator, I want to aggregate scheme data from multiple government sources, so that users can access comprehensive scheme information in one place.

#### Acceptance Criteria

1. THE Data_Pipeline SHALL ingest scheme data from government sources into the Scheme_Repository
2. WHEN scheme data is ingested, THE Data_Pipeline SHALL validate that each scheme contains id, name, description, ministry, state_applicability, category, eligibility_constraints, benefits, required_documents, and official_link fields
3. WHEN duplicate schemes are detected during ingestion, THE Data_Pipeline SHALL prevent duplicate entries in the Scheme_Repository
4. THE Data_Pipeline SHALL standardize unstructured government data into a consistent schema
5. THE Scheme_Repository SHALL store at least 3000 government schemes
6. WHEN scheme data is stored, THE System SHALL preserve all original information without data loss

### Requirement 2: Full-Text Search

**User Story:** As a user, I want to search for schemes using keywords, so that I can quickly find relevant programs.

#### Acceptance Criteria

1. WHEN a user types in the search field, THE System SHALL debounce the input for 300ms before executing the search
2. WHEN a search query is submitted, THE Search_Service SHALL perform full-text matching against scheme names, descriptions, categories, and ministries
3. WHEN search results are returned, THE System SHALL display matching schemes with relevant information highlighted
4. WHEN a search query returns no results, THE System SHALL display a message indicating no schemes were found
5. THE Search_Service SHALL return search results within 500ms for queries against the full scheme dataset

### Requirement 3: Multi-Dimensional Filtering

**User Story:** As a user, I want to filter schemes by multiple criteria, so that I can narrow down relevant programs based on my circumstances.

#### Acceptance Criteria

1. THE Filter_Service SHALL support filtering by state, ministry, gender, age_range, income_range, caste_category, employment_status, and disability_status
2. WHEN multiple filters are applied, THE Filter_Service SHALL combine them using AND logic to return schemes matching all criteria
3. WHEN filters are applied, THE System SHALL update the displayed scheme list within 200ms
4. WHEN a filter is removed, THE System SHALL restore the scheme list to reflect the remaining active filters
5. THE System SHALL display the count of schemes matching the current filter combination
6. WHEN no schemes match the applied filters, THE System SHALL display a message indicating no matching schemes

### Requirement 4: Rule-Based Eligibility Evaluation

**User Story:** As a user, I want to check my eligibility for schemes, so that I can identify programs I qualify for.

#### Acceptance Criteria

1. THE Eligibility_Form SHALL collect user information across 6 steps including personal details, location, demographics, income, employment, and special categories
2. WHEN the eligibility form is submitted, THE Eligibility_Engine SHALL evaluate each scheme's constraints against the user's provided information
3. THE Eligibility_Engine SHALL use deterministic AND-based logic where all constraints must be satisfied for a scheme to be eligible
4. WHEN evaluating eligibility, THE Eligibility_Engine SHALL assign a weighted score based on how closely the user matches scheme criteria
5. WHEN eligibility evaluation is complete, THE System SHALL display schemes sorted by eligibility score with eligible schemes first
6. THE Eligibility_Engine SHALL complete evaluation for all 3000+ schemes within 2 seconds
7. WHEN a user's information does not match any scheme constraints, THE System SHALL display a message indicating no eligible schemes were found

### Requirement 5: Scheme Detail Display

**User Story:** As a user, I want to view comprehensive details about a scheme, so that I can understand the benefits, requirements, and application process.

#### Acceptance Criteria

1. WHEN a user selects a scheme, THE System SHALL display a detail page with scheme name, description, ministry, state_applicability, category, eligibility_criteria, benefits, required_documents, and official_link
2. THE System SHALL format eligibility criteria in a clear, readable manner
3. THE System SHALL display required documents as a structured list
4. WHEN an official link is available, THE System SHALL provide a clickable link to the government scheme page
5. THE System SHALL display the scheme detail page within 300ms of user selection

### Requirement 6: User Authentication

**User Story:** As a user, I want to create an account and log in, so that I can save schemes and access them later.

#### Acceptance Criteria

1. THE Auth_Service SHALL support user registration with email and password
2. WHEN a user registers, THE Auth_Service SHALL validate email format and password strength
3. THE Auth_Service SHALL support user login with email and password
4. WHEN login credentials are invalid, THE Auth_Service SHALL return an error message without revealing whether the email or password was incorrect
5. THE Auth_Service SHALL issue session tokens upon successful authentication
6. THE Auth_Service SHALL enforce Row-Level Security policies to ensure users can only access their own saved schemes
7. WHEN a session token expires, THE System SHALL prompt the user to log in again

### Requirement 7: Scheme Bookmarking and Saved Schemes

**User Story:** As an authenticated user, I want to save schemes to my dashboard, so that I can easily access them later.

#### Acceptance Criteria

1. WHEN an authenticated user bookmarks a scheme, THE System SHALL store the association between the user and scheme in the Scheme_Repository
2. WHEN an authenticated user views their dashboard, THE User_Dashboard SHALL display all saved schemes
3. WHEN an authenticated user removes a saved scheme, THE System SHALL delete the association from the Scheme_Repository
4. THE System SHALL prevent unauthenticated users from saving schemes
5. WHEN an unauthenticated user attempts to save a scheme, THE System SHALL prompt them to log in
6. THE User_Dashboard SHALL display saved schemes with the same information as the browse view

### Requirement 8: Pagination and Performance

**User Story:** As a user, I want the system to load quickly and handle large datasets efficiently, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. THE System SHALL paginate scheme lists with 20 schemes per page
2. WHEN a user navigates to a new page, THE System SHALL load the next page of results within 300ms
3. THE Filter_Service SHALL perform filtering operations in-memory for optimal performance
4. THE System SHALL load the initial page view within 2 seconds
5. WHEN the user scrolls through paginated results, THE System SHALL maintain filter and search state

### Requirement 9: Data Processing Pipeline

**User Story:** As a system administrator, I want a reliable data processing pipeline, so that scheme data remains accurate and up-to-date.

#### Acceptance Criteria

1. THE Data_Pipeline SHALL clean unstructured government data by removing inconsistencies and formatting errors
2. THE Data_Pipeline SHALL standardize field names and values across different government sources
3. WHEN the Data_Pipeline encounters invalid data, THE Data_Pipeline SHALL log the error and continue processing remaining records
4. THE Data_Pipeline SHALL validate that all required fields are present before inserting schemes into the Scheme_Repository
5. THE Data_Pipeline SHALL generate a processing report indicating the number of schemes processed, errors encountered, and duplicates prevented

### Requirement 10: Security and Privacy

**User Story:** As a user, I want my personal information to be secure, so that my privacy is protected.

#### Acceptance Criteria

1. THE System SHALL store minimal personally identifiable information
2. THE Auth_Service SHALL hash passwords using industry-standard algorithms before storage
3. THE Scheme_Repository SHALL enforce Row-Level Security policies to prevent unauthorized data access
4. THE System SHALL transmit all data over HTTPS
5. WHEN eligibility information is collected, THE System SHALL not persist the data beyond the current session unless explicitly saved by an authenticated user
6. THE System SHALL comply with data protection requirements for handling user information

### Requirement 11: Constraint Matching Algorithm

**User Story:** As a developer, I want a deterministic constraint matching algorithm, so that eligibility results are consistent and predictable.

#### Acceptance Criteria

1. THE Eligibility_Engine SHALL evaluate each constraint independently before combining results
2. WHEN a scheme has multiple constraints, THE Eligibility_Engine SHALL require all constraints to be satisfied for eligibility
3. THE Eligibility_Engine SHALL handle missing user information by treating it as not satisfying optional constraints
4. WHEN a constraint involves a range (age, income), THE Eligibility_Engine SHALL check if the user's value falls within the specified range
5. WHEN a constraint involves categorical values (state, gender, caste), THE Eligibility_Engine SHALL check for exact matches
6. THE Eligibility_Engine SHALL produce identical results when given the same user information and scheme data

### Requirement 12: Scalability and Reliability

**User Story:** As a system administrator, I want the system to scale horizontally and handle high traffic, so that users have reliable access during peak times.

#### Acceptance Criteria

1. THE System SHALL support horizontal scaling by adding additional frontend instances
2. THE System SHALL handle read-heavy workloads efficiently through database query optimization
3. WHEN multiple users access the system simultaneously, THE System SHALL maintain response times within specified performance thresholds
4. THE Scheme_Repository SHALL use database indexes on frequently queried fields to optimize performance
5. THE System SHALL handle at least 1000 concurrent users without degradation in response times
