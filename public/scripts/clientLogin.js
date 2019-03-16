$('#signupForm').submit(function(event) {
	event.preventDefault(); 
	var post_username = $(this).attr('action');
	var form_data = $(this).serialize();
	
	var isVerified = verify(form_data);
	
	//$.post(post_url, form_data, function(response) {
	//	$('#server-results').html(response);
	//});
});

function isVerified(form_data) {
	console.log(form_data);
}