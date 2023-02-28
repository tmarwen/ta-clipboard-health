# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Ticket 1
Title: Add new table mapping Agents custom_ids and Facilities

Description: In order to support mapping Agents by a custom identifier for each Facility, we need to add a new table mapping each Facility and Agent to the desired new custom_id.

Acceptance Criteria:
- A new table named `AgentsCustomIds` is added with columns `agent_id`, `facility_id` and `custom_id`
- Both `agent_id` and `facility_id` columns are NON NULL foreign key columns
- The `custom_id` column respects a pre-defined format. It be a string of 50 maximum alphanumeric characters
- 
Time/Effor: 2 hours

Implementation details:
- Use a database migration (script or tool) to create the new `AgentsCustomIds` table
- `AgentsCustomIds` table needs to have 3 columns with `custom_id` being `VARCHAR(50)` and `agent_id` and `facility_id` being `FOREIGN KEY`s referencing `Agents.id` and `Facilities.id` respectively
- Add new indexes over the `AgentsCustomIds` `agent_id` and `facility_id` columns

### Ticket 2
Title: Implement new API endpoints for `AgentsCustomIds` creation and update

Description: To allow for `AgentsCustomIds` creation, new POST and PUT API endpoints should be created.

Acceptance Criteria:
- A new `POST /facility/{:id}/agent/{:id}/customid` endpoint is created
- A new `PUT /facility/{:id}/agent/{:id}/customid` endpoint is created

Time/Effor: 4 hours

Implementation details:
- Implement a new route endpoint allowing to create a new `AgentsCustomIds` entry in the database based on submitted request data
- Implement a new route endpoint allowing to update an existing `AgentsCustomIds` `custom_id` in the database based on submitted request data
- Implement integration tests for the new endpoints

### Ticket 3
Title: Allow Facilities to add new Agents custom_id

Description: Facilities need to have a dedicated page where they can enter the new custom id for Agents they collaborate with.

Acceptance Criteria:
- The Facilities dashboard is upddate to include a new page allowing to enter `custom_id`s for Agents
- The page should only display Agents visible to the user logged in (as part of the Facility authority)
- When a `custom_id` is filled for an Agent, it should be stored in the new `AgentsCustomIds` table mapping the Facility to the selected Agent
- When a `custom_id` is left for an Agent, there should be no errors within the page
- A user should not be able to enter a `custom_id` violating the database constraints

Time/Effor: 8 hours

Implementation details:
- Add a new web page using current stack within the Facilities dashboard web app
- Use scrollable list to display Agents visible to the authenticated user (Facility manager)
- Use a button to update a selected Agent and a form to add the new `custom_id` field
- Add form input validation for the `custom_id` field along with proper user prompts and validation errors
- Use new creation and update endpoints to create or update an Agent `custom_id`
- Implement UI tests for the new web page

### Ticket 4
Title: Includ custom_id in report generation

Description: To fill report with new Agent custom ids, the `generateReport` function needs to be updated to support the new field.

Acceptance Criteria:
- The `generateReport` function is updated to use the new `custom_id` field instead of the database internal `Agents` id
- The Facilities filled `Agents` `custom_id` needs to be filled in the final PDF report

Time/Effor: 4 hours

Implementation details:
- Update the `getShiftsByFacility` function to return the `Agents` `custom_id` within the Agents metadata if any exists for an Agent
- Update the `generateReport` function to use the returned `custom_id` within the `Agents` metadata instead of the database internal identifier if the latter exists
- Update existing unit tests for both `getShiftsByFacility` and `generateReport` functions to include cases validating the existance of the `custom_id`

### Ticket 5 (Optional)
Title: Add a possibility to dynamically select the report displayed identifier

Description: To retain previous behavior and allow for dynamic identifiers usage, we may add an option to select or unselect `custom_id`s usage when Facilities generates reports.

Acceptance Criteria:
- A new option is added to the report creation page stating whether to use Agents `custom_id` or internal database id
- If the new option is checked, the generated report should include only custom ids

Time/Effor: 2 hours

Implementation details:
- Add a new checkbox to the report generation web page using the current framework stack
- Update the `generateReport` function to use the new option when the request is submitted and to either use `custom_id` or internal database identifier
- Implement unit tests for `generateReport` validating its output when `custom_id` choise is set or unset
