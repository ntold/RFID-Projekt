import Api from './Api'

export default{

    getAll(){
        return Api().get('getAll')
    },

    update(rfid){
        return Api().post('update', rfid)
    },

    remove(rfid){
        return Api().post('delete', rfid)
    }

}