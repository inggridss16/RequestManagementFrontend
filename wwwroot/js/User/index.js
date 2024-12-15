$(function () {
    Control.Init();
});

let Selector = {
    hdnDivisionId: "#hdn-division-id",
    hdnRoleId: "#hdn-role-id",
    hdnUserId: "#hdn-user-id",
    tblUser: "#tbl-user",
    btNewUser: "#bt-new-user",
}

let Control = {
    Init: function () {
        Control.Event();
        TableUser.Init();
    },
    Event: function () {
        $(Selector.btNewUser).off("click").on("click", function () {
            window.location.href = 'User/Details'
        });
    },

    
}

let Api = {
    UrlBase: $('#hdn-web-api-url').val() + "api/User/",

    TableUser: function (userId, page, pageSize, onSuccess, onFailed) {
        let params = {
            userId: userId,
            page: page,
            pageSize: pageSize,
        };

        $.ajax({
            url: Api.UrlBase + "GetVwUser",
            type: "GET",
            data: params,
        }).done(function (data) {
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function') {
                onFailed(jqXHR.responseText);
            }
        });
    },
}

let TableUser = {
    Table: {},

    Init: function () {
        TableUser.Table = $(Selector.tblUser).DataTable({
            "processing": true,
            "serverSide": true,
            "language": {
                "emptyTable": "No data available in table",
            },
            "ajax": function (data, callback, settings) {
                let userId = $(Selector.hdnUserId).val();
                let page = data.start / data.length + 1;
                let pageSize = data.length;

                Api.TableUser(
                    userId,
                    page,
                    pageSize,
                    function (response) {
                        if (response) {
                            callback({
                                draw: data.draw,
                                recordsTotal: response.totalCount,
                                recordsFiltered: response.totalCount,
                                data: response.data
                            });
                        } else {
                            console.error("API error:", response);
                        }
                    }
                );
            },
            "filter": false,
            "ordering": false,
            "destroy": true,
            "scrollX": true,
            "autoWidth": false,
            "columns": [
                {
                    // NEW COLUMN: Action Buttons
                    data: null,
                    render: function (data, type, row) {
                        return '<button class="btn btn-sm btn-primary edit-user-btn" data-id="' + row.id + '">Edit</button>'; // Example button
                    },
                },
                {
                    data: "userName",
                    /*render: function (data, type, row) {
                        return '<a href="Request/Details?idValue=' + row.id + '">' + data + '</a>';
                    }*/
                },
                { data: "organization"},
                { data: "division"},
                { data: "role"},
            ],
        });

        TableUser.Event();
    },
    Reload: function () {
        TableUser.Table.ajax.reload(null, false);
    },
    Export: function () {
    },
    Event: function () {
        $(Selector.tblUser).on('click', '.edit-user-btn', function () {
            let userId = $(this).data('id');
            window.location.href = `User/Details?id=${userId}`;
        });
    }
}