import moment from "moment";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Query } from "appwrite";

export const notify = {
    succes: (message) => {
        toast.success(message,
            {
                duration: 5000,
                style: {
                    borderRadius: '5px',
                    background: '#333',
                    color: '#fff'
                }
            }
        );
    },

    error: (message) => {
        toast.error(message,
            {
                duration: 5000,
                style: {
                    borderRadius: '5px',
                    background: '#333',
                    color: '#fff'
                }
            }
        );
    }
};

export const dateFormat = (dateString) => {
    if (dateString && moment(dateString).isValid()) {
        return moment(dateString).format('DD MMM YYYY');
    }

    return null;
}

export const dateTimeFormat = (dateString) => {
    if (dateString && moment(dateString).isValid()) {
        return moment(dateString).format('DD MMM YYYY hh:mm:ss a')
    }

    return null;
}

export const confirm = (confirmMessage, callback) => {
    Swal.fire({
        title: 'Are you sure?',
        text: confirmMessage,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        reverseButtons: true,
        width: 400,
        heightAuto: true,
        focusConfirm: true
    }).then((confirmed) => {
        callback(confirmed && confirmed.value === true)
    });
}

export const getRecordId = async (listLoader, prop = 'Id') => {
    let recordId = 0;
    const lastRecord = await listLoader([Query.orderDesc(prop), Query.limit(1)]);
    if (lastRecord.documents.length > 0) {
        recordId = lastRecord.documents[0][prop] + 1;
    } else {
        recordId = 1;
    }

    return recordId;
}