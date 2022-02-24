(function($) {

    main();
    const todaysDate = new Date();
    document.getElementById("dob").max = calenderFormatDate(todaysDate);

    async function main(){
        await navbarUpdate();
    }


    $('#modalCloseBtn').on("click", function (e){
        $('#login-form')[0].reset();
        $('#signup-form')[0].reset();
        $(".form-control").removeClass('is-invalid');
        $('.alert').hide();
    });

    function calenderFormatDate(date){
        console.log(date.getMonth())
        let dateString, year, month, day;

        year = date.getFullYear();

        if (date.getMonth() + 1 < 9) month = `0${date.getMonth() + 1}`;
        else month = date.getMonth() + 1;

        if (date.getDate() < 9) day = `0${date.getDate()}`;
        else day = date.getDate();

        return `${year}-${month}-${day}`;
    }

    $("#login-form").submit(async function (event) {
        $('#signup-success').hide();
        event.preventDefault();

        var formData = {
            email: $("#login-email").val(),
            password: $("#login-password").val(),
        };

        /*------------ Client Side Validation Start -------------*/

        let validForm = true;
        if (formData.email.trim().length === 0 || !ValidateEmail(formData.email)) {
            validForm = false;
            $("#login-email").addClass('is-invalid');
        }
        else $("#login-email").removeClass('is-invalid');

        if (formData.password.trim().length === 0) {
            validForm = false;
            $("#login-password").addClass('is-invalid');
        }
        else $("#login-password").removeClass('is-invalid');

        /*------------ Client Side Validation End -------------*/

        if (validForm) await authForm(formData, '/auth/login/', 'login');
    });

    function ValidateEmail(email)
    {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return true;
        return false;
    }

    $("#signup-form").submit(async function (event) {

        event.preventDefault();
        var formData = {
            firstName: $("#first-name").val(),
            lastName: $("#last-name").val(),
            email: $("#signup-email").val(),
            phoneNo: $("#phone-no").val(),
            dob: $("#dob").val(),
            password: $("#signup-password").val(),
            confirmPassword: $("#signup-confirm-password").val(),
        };

        /*------------ Client Side Validation Start -------------*/
        let validForm = true;

        if (formData.firstName.trim().length === 0) { validForm = false; $("#first-name").addClass('is-invalid');}
        else $("#first-name").removeClass('is-invalid');

        if (formData.lastName.trim().length === 0) { validForm = false; $("#last-name").addClass('is-invalid');}
        else $("#last-name").removeClass('is-invalid');

        if (formData.email.trim().length === 0 || !ValidateEmail(formData.email) ) { validForm = false; $("#signup-email").addClass('is-invalid');}
        else $("#signup-email").removeClass('is-invalid');

        if (formData.phoneNo.trim().length === 0 || !formData.phoneNo.match(/^\d{10}$/)) { validForm = false; $("#phone-no").addClass('is-invalid');}
        else $("#phone-no").removeClass('is-invalid');

        if (formData.dob.trim().length === 0) { validForm = false; $("#dob").addClass('is-invalid');}
        else $("#dob").removeClass('is-invalid');

        if (formData.password.trim().length === 0) { validForm = false;$("#signup-password").addClass('is-invalid');}
        else $("#signup-password").removeClass('is-invalid');

        if (formData.confirmPassword.trim().length === 0) { validForm = false;$("#signup-confirm-password").addClass('is-invalid');}
        else $("#signup-confirm-password").removeClass('is-invalid');

        /*------------ Client Side Validation End -------------*/

        if (validForm) await authForm(formData, '/auth/signup/', 'signup');
    });

    async function navbarUpdate(){
        const res = await auth();

        if (res.authStatus) {
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
                url: '/auth/auth-status/',
        })
            if (! result.authStatus) sessionStorage.clear();
            return result
        }catch (e) {
            console.log(e)
        }
    }

    async function authForm(formData, url, type){

        const spinner = '<div class="spinner-border text-light" role="status"><span class="visually-hidden"></span></div>   PLEASE WAIT ...';

        if (type === 'login') {
            $('#login-button').attr("disabled", true);
            $('#login-button').html(spinner);
        }
        else {
            $('#signup-button').attr("disabled", true);
            $('#signup-button').html(spinner);
        }
        try{
            const result = await $.ajax({
                method: 'POST',
                url: url,
                dataType: "json",
                encode: true,
                data: formData,

                success: async function (response) {

                    sessionStorage.setItem('authenticated','true');
                    sessionStorage.setItem('firstName', response.firstName);
                    await navbarUpdate();

                    if (type === 'login')$('#authModal').modal('toggle');
                    else {
                        $('#pills-home-tab').click();
                        $('#signup-success').html("Your account was created successfully, Login Please");
                        $('#signup-success').show();
                    }

                    if (window.location.href.includes('profile')) window.location.replace('/');

                    if (type === 'login') { $('#login-error').html(""); $('#login-error').hide();
                    }
                    else $('#signup-error').html("");

                    $('#login-form')[0].reset();
                    $('#signup-form')[0].reset();
                },
            });
        }catch (e){

            if (type === 'login') { $('#login-error').html(e.responseJSON.error); $('#login-error').show();}
            else { $('#signup-error').html(e.responseJSON.error); $('#signup-error').show(); }
        }

        if (type === 'login') { $('#login-button').html('LOGIN');$('#login-button').attr("disabled", false); }
        else { $('#signup-button').html('SIGN UP'); $('#signup-button').attr("disabled", false); }

    }

    $("#nav-logout").on("click", async function (e){ await logout();});

    async function logout() {
        try{
            const result = await $.ajax({
                method: 'GET',
                url: '/auth/logout',

                success: async function (response) {
                    sessionStorage.clear();
                    await navbarUpdate();
                    if (window.location.href.includes('profile')) window.location.replace('/');
                },
            });
        }catch (e){console.log(e)}
    }

})(window.jQuery);

