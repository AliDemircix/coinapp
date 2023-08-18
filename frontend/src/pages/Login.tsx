import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Paths from "../Paths";
import { addUser,  loginUser } from '../api/userServices';
import useAlert from '../hooks/useAlert';
import Cookies from 'js-cookie';

export default function Login() {
    const { setAlert } = useAlert();
    const navigate = useNavigate();
    const [signup, setSignup] = useState(false);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (signup) {
            addUser(data).then(res => {
                console.log(res)
                if (res.status===201) {
                    setAlert(res.message, "success")
                    navigate(Paths.login.path)
                }
                else if (res.status===409){
                    setAlert(res.message, "warning")
                }
                else {
                    setAlert("User could not created. ", "error")
                }
            }
            )
        }
        else if(!signup){
            loginUser(data).then(res => {
                console.log(res)
                if (res.status===200) {
                    Cookies.set('token', res.access_token);
                    sessionStorage.setItem('token', res.access_token);
                    setAlert(res.message, "success")
                    navigate(Paths.admin.path)
                }
                else if (res.status===409){
                    setAlert(res.message, "warning")
                }
                else {
                    setAlert("Missing Parameters. ", "error")
                }
            }
            )
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {signup ? "Sign Up" : "Sign In"}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
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
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {signup ? "Sign up" : "Sign In"}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Typography sx={{ cursor: "pointer", textDecoration: "underline" }} color='primary' variant='body2' onClick={() => {
                                setSignup(!signup);
                                if (signup) {
                                    navigate(Paths.login.path)
                                    setSignup(false);
                                }
                                else {
                                    navigate(Paths.create.path)
                                    setSignup(true)
                                }
                            }}> {signup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}</Typography>

                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}