module.exports = {


    createEmail: (toName, id) => {
        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">        
                <style>
                    a {
                        text-decoration: none !important;
                        color:rgb(255, 155, 73);
                    }
                    a:hover{
                        color:rgb(51, 136, 120);
                        text-decoration: none;
                    }
                    #intro {
                        padding: 0 2rem;
                    }
                    .container-mk {
                        display: flex;
                    }
                    .column-mk {
                        flex-direction: column;
                    }
                    .align-center{
                        align-items: center;
                    }
                    .text-center {
                        text-align: center;
                    }
                    .block {
                        display: block;
                    }
                    .btn-login {
                        background-color: rgb(255, 155, 73);
                        border: none;
                        width: 7rem;
                        padding: .4rem 0 .5rem 1.5rem;
                        border-radius: 1.3rem;
                        color: rgb(0, 0, 0) !important;
                    }
                    .btn-login:hover {
                        color:rgb(70, 245, 236) !important;
                        transform: scale(1.1) !important;
                    }
            
            </style>
        </head>
        <body>
            <table>
                <tr>
                    <td>
                        <h3>¡Hola ${toName}!</h3>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Parece que quieren que intentes hacer éste test, ¿te atreves?</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <a class="block btn-login" href="https://team-to-learn.herokuapp.com/test/do/${id}">Empezar test</a>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    },
    createTokenEmail: (user, token) => {
        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">        
                <style>
                    a {
                        text-decoration: none !important;
                        color:rgb(255, 155, 73);
                    }
                    a:hover{
                        color:rgb(51, 136, 120);
                        text-decoration: none;
                    }
                    #intro {
                        padding: 0 2rem;
                    }
                    .container-mk {
                        display: flex;
                    }
                    .column-mk {
                        flex-direction: column;
                    }
                    .align-center{
                        align-items: center;
                    }
                    .text-center {
                        text-align: center;
                    }
                    .block {
                        display: block;
                    }
            </style>
        </head>
        <body>
            <table>
                <tr>
                    <td>
                        <h3>¡Hola ${user.name}!</h3>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Por favor, verifica tu cuenta haciendo click en el siguiente link:</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <a class="block btn-login" href="https://team-to-learn.herokuapp.com/auth/confirmation/${user.email}/${token.token}">Verificar cuenta</a>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    },

    createResetTokenPwd: (user, token) => {
        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">        
                <style>
                    a {
                        text-decoration: none !important;
                        color:rgb(255, 155, 73);
                    }
                    a:hover{
                        color:rgb(51, 136, 120);
                        text-decoration: none;
                    }
                    #intro {
                        padding: 0 2rem;
                    }
                    .container-mk {
                        display: flex;
                    }
                    .column-mk {
                        flex-direction: column;
                    }
                    .align-center{
                        align-items: center;
                    }
                    .text-center {
                        text-align: center;
                    }
                    .block {
                        display: block;
                    }
            </style>
        </head>
        <body>
            <table>
                <tr>
                    <td>
                        <h3>¡Hola ${user.name}!</h3>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Para poder cambiar tu contraseña haz click en el siguiente link, por favor:</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <a class="block btn-login" href="https://team-to-learn.herokuapp.com/auth/resetPwd/${user.email}/${token}">Obtener nueva contraseña</a>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    },

}