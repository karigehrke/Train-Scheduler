// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCotxBI7SVS-uxCLM3XfsANUuc5I7Jr7xc",
    authDomain: "train-scheduler-25ff2.firebaseapp.com",
    databaseURL: "https://train-scheduler-25ff2.firebaseio.com",
    projectId: "train-scheduler-25ff2",
    storageBucket: "train-scheduler-25ff2.appspot.com",
    messagingSenderId: "428674870628"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding Trains
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input---------------------FIX MOMENT FOR FIRST TRAIN-----------
    var empName = $("#train-name-input").val().trim();
    var empDest = $("#dest-input").val().trim();
    var empFirstTrain = $("#time-input").val().trim();
    var empFrequency = $("#frequency-input").val().trim();
    // var empFirstTrain = moment($("#time-input").val().trim(), "HH:mm").format("HH:mm");

    // Creates local "temporary" object for holding train data
    var newTrain = {
      dbName: empName,
      dbDest: empDest,
      dbFirstTrain: empFirstTrain,
      dbFrequency: empFrequency
    };
    
    console.log(newTrain);

    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.dbName);
    console.log(newTrain.dbDest);
    console.log(newTrain.dbFirstTrain);
    console.log(newTrain.dbFrequency);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#dest-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var empName = childSnapshot.val().dbName;
    var empDest = childSnapshot.val().dbDest;
    var empFirstTrain = childSnapshot.val().dbFirstTrain;
    var empFrequency = childSnapshot.val().dbFrequency;
  
    // Train Info
    console.log(empName);
    console.log(empDest);
    console.log(empFirstTrain);
    console.log(empFrequency);

    //First Time
    var firstTrainConvert = moment(empFirstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTrainConvert);

    //Current Time
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("HH:mm"));

    //Difference between times
    var diffTime = moment().diff(moment(firstTrainConvert), "minutes");
    console.log("Difference in time: " + diffTime);
  
    //Time apart (remainder)
    var timeRemain = diffTime % empFrequency;
    console.log(timeRemain);

    //Minutes until next train
    var minAway = empFrequency - timeRemain;
    console.log("Minutes until next train: " + minAway);

    //Next train arrival
    var nextArrival = moment().add(minAway, "minutes");
    console.log("Next Arrival: " + moment(nextArrival).format("h:mm a"));

    // Prettify the train start
    var prettyTime = moment(nextArrival).format("h:mm a");

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(empName),
      $("<td>").text(empDest),
      $("<td>").text(empFrequency),
      $("<td>").text(prettyTime),
      $("<td>").text(minAway)
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  