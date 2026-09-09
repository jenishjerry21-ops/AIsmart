import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import axios from 'axios';

const validationSchema = Yup.object({
    email: Yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setLoading(true);
          axios.post('http://localhost:5256/api/AI/login', {
            email: values.email,
            password: values.password,
          })
            .then((response) => {
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('id', response.data.userid);
                sessionStorage.setItem('role', response.data.role);

                navigate('/Home');
            })
            .catch((error) => {
                if (error.response && (error.response.status === 400 || error.response.status === 401)) {
                    toast.error('Invalid email or password.');
                } else {
                    toast.error('Login failed. Please try again later.');
                }
                console.error("Login error:", error);
            })
            .finally(() => {
                setLoading(false);
            });
           
        },
    });

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default'
        }}>
            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={6}
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 4,
                        borderRadius: 2,
                    }}
                >
                    <AutoGraphIcon sx={{ m: 1, fontSize: 40, color: 'primary.main' }} />
                    <Typography component="h1" variant="h5">
                        Login to AI Smart
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;