window.onload = function() {
    var url = "http://s3.amazonaws.com/pushpinapp/stats.json"

    $.get(url, function(json) {
        if (json) {
            $('#total-edits').html(json.total_edits);

            numberOfEditsInLast24Hours = 0;
            var now = moment(new Date);
            _.each(json.recent_edits, function(edit) {
                var editDate = moment(edit.date);

                if (now.diff(editDate, 'minutes') < 1440)
                  numberOfEditsInLast24Hours++;
            });
            $('#last-24').html(numberOfEditsInLast24Hours);
            $('#total-users').html(json.top_users.length);
        }
    });
}