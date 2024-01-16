import toast from "react-hot-toast";
import Swal from "sweetalert2";

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
    if (dateString) {
        const dateObj = new Date(dateString);
        if (!isNaN(dateObj.valueOf())) {
            return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(dateObj);
        }

        return null;
    }
}

export const confirm = (confirmMessage, callback) => {
    Swal.fire({
        title: 'Are you sure?',
        text: confirmMessage,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((confirmed) => {
        callback(confirmed && confirmed.value === true)
    });
}