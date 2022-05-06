import Swal from 'sweetalert2';

export default class ToastService {
    AlertErrorMessage(message) {
        Swal.fire({
            text: message,
            target: '#custom-target',
            customClass: {
                container: 'position-absolute'
            },
            toast: true,
            position: 'bottom-right',
            title: 'Error!',
            icon: 'error',

        })
    }

    AlertSuccessMessage(message) {
        return    Swal.fire({
            text: message,
            target: '#custom-target',
            customClass: {
                container: 'position-absolute'
            },
            toast: true,
            position: 'bottom-right',
            title: 'Success!',
            icon: 'success'
        })
    }

    AlertInfoMessage(message) {
        Swal.fire({
            text: message,
            target: '#custom-target',
            customClass: {
                container: 'position-absolute'
            },
            toast: true,
            position: 'bottom-right',
            title: 'Info!',
            icon: 'info'
        })
    }
}
