$(document).ready(function () {
  // Getting references to the name input and user container, as well as the table body
  var nameInput = $("#user-name");
  var userList = $("tbody");
  var userContainer = $(".user-container");
 

  // Adding event listeners to the form to create a new object, and the button to delete
 
  $(document).on("submit", "#user-form", handleUserFormSubmit);

  $(document).on("click", ".delete-user", handleDeleteButtonPress);

  // Getting the initial list user
  getUsers();

  // A function to handle what happens when the form is submitted to create a new user
  function handleUserFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (!nameInput.val().trim().trim()) {
      return;
    }
    // Calling the upsertUser function and passing in the value of the name input
    upsertUser({
      name: nameInput.val().trim(),
    });
  }

  // A function for creating an user. Calls getUser upon completion
  function upsertUser(userData) {
    $.post("/api/user", userData).then(getUsers);
  }

  // Function for creating a new list row for users
  function createUserRow(userData) {
    console.table(userData);

    var newTr = $("<tr>");
    newTr.data("user", userData);
    newTr.append("<td>" + userData.name + "</td>");

    newTr.append(
      "<td><a href='/results?user_id=" +
        userData.id +
        "'>Go to Team-Results</a></td>"
    );
    newTr.append(
      "<td><a href='/teams?user_id=" + userData.id + "'>Create a Team</a></td>"
    );
    newTr.append(
      "<td><a style='cursor:pointer;color:red' class='delete-user'>Delete User</a></td>"
    );
    return newTr;
  }

  // Function for retrieving  users  and getting them ready to be rendered to the page
  function getUsers() {
    $.get("/api/user", function (data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createUserRow(data[i]));
      }
      renderUserList(rowsToAdd);
      nameInput.val("");
    });
  }

  // A function for rendering the list of users to the page
  function renderUserList(rows) {
    userList.children().not(":last").remove();
    userContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      userList.prepend(rows);
    } else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no users
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create an User before you can create a Team.");
    userContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("user");
    console.log(listItemData);
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/user/" + id,
    }).then(getUsers);
  }
});
