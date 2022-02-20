(function($) {
    console.log('here')
    navbarUpdate();

    $("#signup-form").submit(function (event) {

        event.preventDefault();
        var formData = {
            firstName: $("#first-name").val(),
            lastName: $("#last-name").val(),
            email: $("#signup-email").val(),
            phoneNo: $("#phone-no").val(),
            dob: $("#dob").val(),
            password: $("#signup-password").val(),
        };

        authForm(formData, '/signup/');
        console.log(formData);
    });

    async function navbarUpdate(){
        const res = await auth();

        if (res.authStatus) {
            console.log('wtf')
            $('#nav-signup-login').hide();
            $('#nav-account').show();
            $('#nav-account-dropdown').html(`<i class="fas fa-user-circle"></i> Hi ${sessionStorage.getItem('firstName')}`);
        }
        else {
            $('#nav-signup-login').show();
            $('#nav-account-dropdown').html("");
            $('#nav-account').hide();
        }
    }

    async function auth(){
        try {
            const result = await $.ajax({
                method: 'GET',
                url: '/auth-status/',
        })
            if (! result.authStatus) sessionStorage.clear();
            return result
        }catch (e) {
            console.log(e)
        }
    }

    async function authForm(formData, url){
        const spinner = '<div class="spinner-border text-light" role="status"><span class="visually-hidden"></span></div>   PLEASE WAIT ...';
        $('#login-button').attr("disabled", true);
        $('#login-button').html(spinner);
        try{
            const result = await $.ajax({
                method: 'POST',
                url: url,
                dataType: "json",
                encode: true,
                data: formData,

                success: async function (response) {
                    console.log(response);
                    sessionStorage.setItem('authenticated','true');
                    sessionStorage.setItem('firstName', response.firstName);
                    await navbarUpdate();
                    $('#exampleModal').modal('toggle');
                },
            });
        }catch (e){console.log(e)}
        $('#login-button').html('LOGIN');
        $('#login-button').attr("disabled", false);
    }

    $("#login-form").submit(function (event) {

        event.preventDefault();
        var formData = {
            email: $("#login-email").val(),
            password: $("#login-password").val(),
        };
        authForm(formData, '/login/');
    });

    $("#nav-logout").on("click", function (e){ logout();});

    async function logout() {
        try{
            const result = await $.ajax({
                method: 'GET',
                url: '/logout',

                success: function (response) {
                    sessionStorage.clear();
                    navbarUpdate();
                    if (window.location.href.includes('profile')) window.location.replace('/');
                },
            });
        }catch (e){console.log(e)}
    }


})(window.jQuery);