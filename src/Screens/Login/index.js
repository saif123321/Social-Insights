import { useState, useEffect } from 'react';
import { styles } from "./style";
import { TextInput } from 'react-native-paper';
import {
	Text,
	TouchableOpacity,
	View,
	Image,
	ActivityIndicator
} from 'react-native';
import { login } from '../../redux/actions/authActions';
import { useDispatch } from 'react-redux';
import { useToast } from "react-native-toast-notifications";

export const LoginPage = ({ navigation: { navigate } , route  }) => {
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);
	const [hidePassword, setHidePassword] = useState(true);
	const [form_response, setFormResponse] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();

	const showToast = () => {
		useEffect(() => {
			if (route.params && route.params.message) {
				toast.show("Congrats! Your account has been created please Sign in to start using app..", {
					type: "success",
					placement: "top",
					duration: 4000,
					offset: 30,
					animationType: "slide-in",
				  });
			}
		}, [route.params]);
	};
	showToast();

	const validateForm = () => {
		const errors = {};
		if (!email) {
			errors.email = 'Email is required';
		} else if (!isValidEmail(email)) {
			errors.email = 'Invalid email format';
		}
		if (!password) {
			errors.password = 'Password is required';
		} 
		const isValid = Object.keys(errors).length === 0;
		setErrors(errors);
		setIsFormValid(isValid);
		return isValid;
	};
	
	const handleSubmit = async e => {
		if (validateForm()) {
			setIsLoading(true);
			e.preventDefault();
			const response = await dispatch(login(email, password));
			if (response.error == "1") {
				setFormResponse('Invalid email address or password')
				setIsLoading(false);
			} else {
				setIsLoading(false);
				console.log(response);
				// navigationdata();
			}
		} else {
		}
	}
	const SignUp = () => {
		navigate('SignUp');
	};
	const navigationdata = () => {
		navigate('Dashboard');
	};

	const IconChange = () => {
		setHidePassword(!hidePassword);
	};

	const isValidEmail = (email) => {
		const emailRegex = /\S+@\S+\.\S+/;
		return emailRegex.test(email);
	};

	return (
		<View style={styles.sectionContainer}>
			<Image
				style={styles.tinyLogo}
				source={require('../.././images/logo.png')}
			/>
			<Text style={styles.LoginTitle}>Login</Text>
			<TextInput
				underlineColor="transparent"
				activeUnderlineColor="black"
				underlineColorAndroid="transparent"
				style={styles.input}
				value={email}
				onChangeText={email => setEmail(email)}
				placeholder="Email"
				theme={{
					roundness: 5,
					colors: {
						placeholder: 'grey',
						primary: 'grey',
					},
					fonts: { regular: { fontFamily: 'Poppins-Light' } },
				}}
				left={<TextInput.Icon icon={require('../../icons/email_icon.png')} />}
			/>
			{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
			<TextInput
				underlineColor="transparent"
				activeUnderlineColor="black"
				underlineColorAndroid="transparent"
				style={styles.input}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry={hidePassword}
				left={<TextInput.Icon

					icon={require('../../icons/password_icon.png')
					}
				/>}
				right={<TextInput.Icon
					onPress={IconChange}
					icon={
						hidePassword
							? require('../../icons/eye_icon.png')
							: require('../../icons/eye_icon_off.png')
					}
				/>}
				theme={{
					roundness: 5,
					colors: {
						placeholder: 'grey',
						primary: 'grey',
					},
					fonts: { regular: { fontFamily: 'Poppins-Light' } },
				}}
			/>
			{errors.password && (
				<Text style={styles.errorText}>{errors.password}</Text>
			)}
			{form_response && (
				<Text style={styles.errorText}>{form_response}</Text>
			)}
			<Text style={styles.forgotTitle}>Forgot Password ?</Text>

			<TouchableOpacity
				style={styles.button}
				onPress={handleSubmit}
			>
				{isLoading ? (
					<ActivityIndicator size="small" color="white" />
				) : (
					<Text style={styles.Buttontext}>SIGN IN</Text>
				)}
			</TouchableOpacity>
			<TouchableOpacity onPress={SignUp} > 
				<Text style={styles.tagLineTextIsignin}>or dont't have an account <Text style={{color : '#438f7f' , fontWeight : 900}}>Sign Up?</Text> </Text> 
			</TouchableOpacity> 
		</View>
	);

};
