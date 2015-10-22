// $(function(){
//   $.ajax({
//       contentType: 'application/json; charset=utf-8',
//       url:'/data/topic4',
//       dataType: 'text',
//       data: "category=Shoes",
//       success: function (results) {
//         var results1 = JSON.parse("[" + results + "]");
//         var results = results1[0];
//         var word_arr = [];
//         for (var i=0; i<results.length; i++){
//           for (var j=0;j<results[i]["words"].length; j++){
//             if($.inArray(results[i]["words"][j]['word'], word_arr) === -1) word_arr.push(results[i]["words"][j]['word']);
//           }
//         }
//         $( "#tags" ).autocomplete({
//           source: word_arr
//         });
//     },
//     error: function (request, status, error) {
//         //alert(error);
//     }
//   });
// });
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