function show_schema(){
  $.ajax({
    contentType: 'application/json; charset=utf-8',
    url:'/data/retrieve_schema_list',
    dataType: 'text',
    success: function (results) {
      console.log(results);
      show_table(results);
    },
    error: function (request, status, error) {
      alert(error);
    }
  });
}