document.addEventListener("DOMContentLoaded", () => {
  // get the form input and fire the event in response to the submit
  const newCaseForm = document.getElementById("newCaseForm");

  newCaseForm.addEventListener("submit", createNewCase);
});

// Creating and adding a new homework and it's descriptions/details

const createNewCase = (caseAdd) => {
  // stop from trying to submit the form
  caseAdd.preventDefault();

  const newCaseName = document.getElementById("caseName");

  const newCaseDescription = document.getElementById("caseDescription");
  const newCase = document.createElement("li");
  newCase.innerText = newCaseName.value + "\n" + newCaseDescription.value;

  appendNewCase(newCase);

  caseAdd.target.reset();
};

const appendNewCase = (caseAdd) => {
  document.getElementById("tentativeCases").appendChild(caseAdd);
};
