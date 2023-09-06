

import moongose from "mongoose"


const connectionDb =async ()=> {

    return await moongose.connect( process.env.DB_CONNECTION_URL)
    .then((result) => {
        // console.log(result);
        console.log("DB Connected");
    }).catch(error => console.log("Catsh Error", error))
}

export default connectionDb