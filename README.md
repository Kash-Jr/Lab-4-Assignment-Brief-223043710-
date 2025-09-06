# Lab-4-Assignment-Brief-223043710-
This is a WAD621S Lab activity

📌 Project Overview:

  -This is a simple web page that allows users to:

  -Register student details using a form

  -Validate input fields before submission

  -Display registered students as profile cards

  -List the same students in a summary table

  -Remove entries from both card and table simultaneously

  -(Optional) Search/filter students by name, programme, or interests

  -Persist data using localStorage (students remain after reload)

🛠️ Features:

  -Form validation with inline error messages and accessibility (aria-live).

  -Profile cards showing each student’s details.

  -Summary table that stays in sync with cards.

  -Remove button deletes the student everywhere.

  -Search bar filters visible students.

  -Responsive design using CSS grid.

📂 File Structure:
  -index.html
  -style.css
  -script.js

🚀 How to Run:

  -Download or clone the project.

  -Open index.html in any modern web browser (no server required).

🔑 Usage:

  -Fill out the registration form with student details.

  -Click Add Student → profile card and table row are created.

  -Use Remove buttons to delete a student.

  -Use the Search bar to filter results.

♿ Accessibility:

  -All inputs have labels.

  -Fieldsets/legends are used for radio buttons and checkboxes.

  -Error messages are announced with aria-live.

  -Keyboard navigation is fully supported.

✅ Testing Checklist:

  -Submitting empty form shows errors.

  -Invalid email is rejected.

  -Valid submission creates both card + table row.

  -Remove works on both card and table.

  -Reloading the page restores saved students.

  -Search bar hides non-matching results.
