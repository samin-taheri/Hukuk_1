import Alert from '@mui/material/Alert';

export default class ToastService {
    AlertErrorMessage(message) {
       return <Alert variant="outlined" severity="error">
            {message}
        </Alert>
    }

    AlertSuccessMessage(message) {
        return <Alert variant="outlined" severity="success">
            {message}
        </Alert>
    }

    AlertWarningMessage(message) {
        return <Alert variant="outlined" severity="warning">
            {message}
        </Alert>
    }
    AlertInfoMessage(message) {
        return <Alert variant="outlined" severity="info">
            {message}
        </Alert>
    }
}
