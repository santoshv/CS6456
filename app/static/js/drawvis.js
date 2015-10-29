$(function(){
  $.ajax({
      contentType: 'application/json; charset=utf-8',
      url:'/data/retrieve_schema_list',
      dataType: 'text',
      success: function (results) {
        console.log(results);
        element = document.getElementById("schema_grid");
        element.innerHTML = results;
    },
    error: function (request, status, error) {
        //alert(error);
    }
  });
});

function printAlert(){
  alert("Hello there!");
  $.ajax({
      contentType: 'application/json; charset=utf-8',
      url:'/data/retrieve_schema',
      dataType: 'text',
      data: "dbid=1",
      success: function (results) {
        console.log(results);
    },
    error: function (request, status, error) {
        //alert(error);
    }
  });
}