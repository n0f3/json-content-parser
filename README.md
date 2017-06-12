# JSON to Google Sheets

Simple application that parses a json document and creates a google sheet document from JSON.

It generates sheet columns from all possible unique values contained within the JSON document, whereas rows represents all JSON elements.
If a JSON element contains a value in the columns, the cell will be 1, otherwise 0.

For example, given this JSON document:

```
{
  "student1": [
    "view_grades",
    "view_classes"
  ],
  "student2": [
    "view_grades",
    "view_classes"
  ],
  "teacher": [
    "view_grades",
    "change_grades",
    "add_grades",
    "delete_grades",
    "view_classes"
  ],
  "principle": [
    "view_grades",
    "view_classes",
    "change_classes",
    "add_classes",
    "delete_classes"
  ]
}
```
The output excel spreadsheet would look like this:

 '' | view_grades | view_classes | change_grades | add_grades | delete_grades | change_classes | add_classes | delete_classes
  --- | --- | --- | --- | --- | --- | --- | --- | ---
  student1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0
  student2 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0
  teacher | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 0
  principle | 1 | 1 | 0 | 0 | 0 | 1 | 1 | 1


## [Live Demo](https://n0f3.github.io/json-content-parser/)

## Usage

A sample JSON document is already loaded when starting the application for the first time. It looks the same as the one explained in the example above.

If you wish to upload a different JSON document it's possible to do so by uploading a new file. The JSON data will be stored in the browser's localStorage.

To process the document to Google Sheets, a sign in using Google's oAuth is necessary. Permissions required will only be for creating and writing excel spreadsheets and will be limited to just Sheets.

After successfull login, to process the JSON object to Sheets, simply use the process to sheets button. If one doesn't exist already, a new Spreadsheet document with a sheet containing the data will be created. The information about this document will be saved in the browser's localStorage, so that it can be reused and overwritten with different JSON data if necessary.

At the moment, support for only one sheet and one spreadsheet is present, multiple sheets within a single spreadsheet may be added in the future.
