//* Libraries
import bcrypt from 'bcrypt'

function encryptPassword(password) {
    return bcrypt.hashSync(password, 10)
}

export default function treatObjectPassword(objectToTreat) {
    
    if(!objectToTreat.password) return

    delete objectToTreat.confirmPassword

    objectToTreat.password = encryptPassword(objectToTreat.password)
}