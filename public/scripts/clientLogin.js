$('#signupForm').submit(function(event) {
	event.preventDefault(); 
	var post_username = $(this).attr('action');
	var form_data = $(this).serialize();
	
	$.post(post_url, form_data, function(response) {
		$('#server-results').html(response);
	});
});