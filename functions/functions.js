module.exports = {


    isEmail: (email) => {
        if(!email.split('').includes('@') || !email.split('@')[1].includes('.')){return false}
        return true
    }

}