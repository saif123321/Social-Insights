import { useState, useEffect } from 'react';
import { styles } from "../Login/style";
import { TextInput } from 'react-native-paper';
import {
	Text,
	TouchableOpacity,
	View,
	Image,
	ActivityIndicator
} from 'react-native';
import { signup } from '../../redux/actions/authActions';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useToast } from "react-native-toast-notifications";

export const SignUpPage = ({ navigation: { navigate } }) => {
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const [fullname, setFullname] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);
	const [hidePassword, setHidePassword] = useState(true);
	const [form_response, setFormResponse] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();
	const validateForm = () => {
		const errors = {};
		if (!fullname) {
			errors.fullname = 'Fullname is required';
		}
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
			const response = await dispatch(signup(email, password, fullname));
			console.log("response : ", response);
			if (response.error == 1) {
				toast.show("Failed! This Email address is already taken.", {
					type: "danger",
					placement: "top",
					duration: 4000,
					offset: 30,
					animationType: "slide-in",
				  });
				setFormResponse('Email address already exist!')
				setIsLoading(false);
			} else {
				setIsLoading(false);
				// setFormResponse('Success');
				navigate('Login', { message: 'Your account has been created please sign in to start using app..' });
			}
		} else {
		}
	}
	const SignIn = () => {
		navigate('Login');
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
			<Text style={styles.LoginTitle}>SignUp</Text>
			<TextInput
				underlineColor="transparent"
				activeUnderlineColor="black"
				underlineColorAndroid="transparent"
				style={styles.input}
				value={fullname}
				onChangeText={fullname => setFullname(fullname)}
				placeholder="Fullname"
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
			{errors.fullname && <Text style={styles.errorText}>{errors.fullname}</Text>}
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

			<TouchableOpacity
				style={styles.button}
				onPress={handleSubmit}
			>
				{isLoading ? (
					<ActivityIndicator size="small" color="white" />
				) : (
					<Text style={styles.Buttontext}>SIGN UP</Text>
				)}
			</TouchableOpacity>
			<TouchableOpacity onPress={SignIn} >
				<Text style={styles.tagLineTextIsignin}>Already have an account <Text style={{ color: '#438f7f', fontWeight: 900 }}>Sign In</Text> </Text>
			</TouchableOpacity>
		</View>
	);

};
