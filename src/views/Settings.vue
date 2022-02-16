<template>
    <div class="settings">
        <!-- HeadFul Plugin For Set Title and Meta Tags Dynamically -->
        <vue-headful
            :title="'Settings - ' + appName"
            :description="description"
            :keywords="keywords"
            :image="favIconUrl"
            :url="url"
        />
        <!-- Set HeadFul End -->
        <!-- Form Start -->
        <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="updateUserInfo()"
        >
            <!-- Container Start -->
            <v-container>
                <!-- Start Row -->
                <v-row>
                    <v-col cols="12">
                        <!-- VueFileAgent plugin for upload image -->
                        <VueFileAgent
                            ref="vueFileAgent"
                            :theme="'list'"
                            :multiple="false"
                            :deletable="true"
                            :meta="true"
                            :accept="'image/*'"
                            :maxSize="'2MB'"
                            :maxFiles="1"
                            :helpText="'Choose profile image'"
                            :errorText="{
                                type: 'Invalid file type. Only images',
                                size: 'Files should not exceed 2MB in size',
                            }"
                            v-model="fileRecord"
                        ></VueFileAgent>
                    </v-col>
                    <v-col cols="12">
                        <v-input class="font-weight-bold">General Settings</v-input>
                    </v-col>
                    <v-col
                        cols="12"
                        xs="12"
                        sm="6"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <v-text-field
                            label="Name"
                            solo-inverted
                            v-model="name"
                            :rules="nameRules"
                            counter
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        xs="12"
                        sm="6"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <v-text-field
                            label="Email"
                            solo-inverted
                            v-model="email"
                            required
                            disabled
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        xs="12"
                        sm="6"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <v-text-field
                            label="Username"
                            solo-inverted
                            v-model="username"
                            :rules="usernameRules"
                            :error-messages="errorMessage"
                            :success-messages="successMessage"
                            @keyup.stop.prevent="checkUsername()"
                            counter
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        xs="12"
                        sm="12"
                        md="6"
                        lg="6"
                        xl="6"
                    >
                        <v-textarea
                            label="Write Bio"
                            solo-inverted
                            v-model="bio"
                            :rules="bioRules"
                            @keyup="bioMinLengthCheck()"
                            :error-messages="bioErrorMessage"
                            counter
                            required
                        ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                        <v-input class="font-weight-bold">Change Password</v-input>
                    </v-col>
                    <v-col
                        cols="12"
                        xs="12"
                        sm="6"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <v-text-field
                            label="Old Password"
                            v-model="oldPassword"  
                            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="passwordShow ? 'text' : 'password'"
                            :error-messages="oldPasswordErrorMessage"                     
                            @click:append="passwordShow = !passwordShow"
                            @keyup="oldPasswordErrorMessage = ''"
                            solo-inverted
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        xs="12"
                        sm="6"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <v-text-field
                            label="New Password"
                            v-model="newPassword" 
                            :append-icon="passwordShow2 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="passwordShow2 ? 'text' : 'password'" 
                            :error-messages="newPasswordErrorMessage" 
                            hint="At least 8 characters"
                            @click:append="passwordShow2 = !passwordShow2"
                            @keyup="newPasswordErrorMessage = ''"                     
                            solo-inverted   
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        xs="12"
                        sm="6"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <v-text-field
                            label="Confirm Password"
                            v-model="confirmPassword"
                            :append-icon="passwordShow3 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="passwordShow3 ? 'text' : 'password'" 
                            :error-messages="confirmPasswordErrorMessage"
                            @click:append="passwordShow3 = !passwordShow3"
                            @keyup="confirmPasswordCheck()"
                            solo-inverted                         
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-input class="font-weight-bold">Social Media</v-input>
                    </v-col>
                    <v-col
                        cols="12"
                        xs="12"
                        sm="6"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <v-text-field
                            label="Facebook Username or Id"
                            solo-inverted
                            v-model="facebookUrl"                           
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        xs="12"
                        sm="6"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <v-text-field
                            label="Twitter Username or Id"
                            solo-inverted
                            v-model="twitterUrl"                           
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        xs="12"
                        sm="6"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <v-text-field
                            label="Instagram Username or Id"
                            solo-inverted
                            v-model="instagramUrl"                            
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        xs="12"
                        sm="6"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <v-text-field
                            label="Pinterest Username or Id"
                            solo-inverted
                            v-model="pinterestUrl"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        xs="12"
                        sm="6"
                        md="4"
                        lg="4"
                        xl="4"
                    >
                        <v-text-field
                            label="Github Username or Id"
                            solo-inverted
                            v-model="githubUrl"                           
                            required
                        ></v-text-field>
                    </v-col>
                </v-row>
                <!-- End Row -->
                <!-- Update Profile Button -->
                <div class="text-center m-4">
                    <v-btn 
                        color="black white--text" 
                        type="submit" 
                        :disabled="!valid || loading"
                        :loading="loading"
                    >
                        <v-icon class="mr-1">mdi-content-save-outline</v-icon> Update Profile
                    </v-btn>
                </div>
                <!-- Snackbar -->
                <v-snackbar
                    v-model="snackbar"
                    :timeout="timeout"
                >
                    Details updated successfully
                    <v-btn
                        color="error"
                        text
                        @click="snackbar = false"
                    >
                        Close
                    </v-btn>
                </v-snackbar>
                <!-- Snackbar End -->
            </v-container>
            <!-- Container End -->
        </v-form>
        <!-- Form End -->
    </div>
</template>

<script>
// Import firebase app
import firebase from 'firebase/app'
// Import firebase auth
import 'firebase/auth'
// Import firebase storage
import 'firebase/storage'
// Import firestore database
import db from '@/firebase/init'

export default {
    name: 'Settings',
    data() {
        return {
            valid: true, // form valid true/false
            loading: false, // vuetify loading spinner for update profile button
            passwordShow: false, // vuetify old password input text show
            passwordShow2: false, // vuetify new password input text show
            passwordShow3: false, // vuetify confirm password input text show
            url: window.location.href, // get current URL
            favIconUrl: '', // fav icon URL
            appName: '', // aplication name
            description: '', // aplication description
            keywords: [], // aplication keywords
            fileRecord: [], // profile image
            name: '', // user name
            nameRules: [ // validation rule for name
                v => !!v || 'Name is required',
                v => v.length >= 6 || 'Min 6 characters',
            ],
            email: '', // user email
            username: '', // user username
            usernameRules: [ // validation rule for username
                v => !!v || 'Username is required',
                v => v.length >= 6 || 'Min 6 characters',
            ],
            bio: '', // user bio
            bioRules: [ // validation rule for bio
                v => v.length <= 200 || 'Max 200 characters',
            ],
            oldPassword: '', // user old password
            newPassword: '', // user new password
            confirmPassword: '', // user confirm password
            facebookUrl: '', // user facebook URL
            twitterUrl: '', // user twitter URL
            instagramUrl: '', // user instagram URL
            pinterestUrl: '', // user pinterest URL
            githubUrl: '', // user github URL
            errorMessage: '', // error message for username
            bioErrorMessage: '', // error message for bio
            oldPasswordErrorMessage: '', // error message for old password
            newPasswordErrorMessage: '', // error message for new password
            confirmPasswordErrorMessage: '', // error message for confirm password
            successMessage: '', // success message for username
            snackbar: false, // vuetify snackbar
            timeout: 2000 // set timeout for snackbar
        }
    },
    created() {
        // get general settings from datebase
        db.collection('settings').doc('general-settings')
        .onSnapshot(doc => {
            this.favIconUrl = doc.data().favIcon
            this.appName = doc.data().appName
        })

        // get seo settings from datebase
        db.collection('settings').doc('seo').get()
        .then(doc => {
            this.description = doc.data().description,
            this.keywords = doc.data().keywords
        })

        // get user data from datebase
        if(this.$store.state.user.loggedIn) { // check user logged in
            db.collection('users').doc(this.$store.state.user.data.uid).get() // get user uid form vuex store
            .then(querySnapshot => {
                // assign data for data property
                this.name = querySnapshot.data().name
                this.email = querySnapshot.data().email
                this.username = querySnapshot.data().username
                this.bio = querySnapshot.data().bio
                this.facebookUrl = querySnapshot.data().facebookUrl
                this.twitterUrl = querySnapshot.data().twitterUrl
                this.instagramUrl = querySnapshot.data().instagramUrl
                this.pinterestUrl = querySnapshot.data().pinterestUrl
                this.githubUrl = querySnapshot.data().githubUrl
            }).catch(err => console.log(err))
        }
    },
    computed: {
        // return error and success messages
        errorMessages() {
            return this.errorMessage ? this.errorMessage : undefined
        }, 
        bioErrorMessages() {
            return this.bioErrorMessage ? this.bioErrorMessage : undefined
        }, 
        oldPasswordErrorMessages() {
            return this.oldPasswordErrorMessage ? this.oldPasswordErrorMessage : undefined
        }, 
        newPasswordErrorMessages() {
            return this.newPasswordErrorMessage ? this.newPasswordErrorMessage : undefined
        }, 
        confirmPasswordErrorMessages() {
            return this.confirmPasswordErrorMessage ? this.confirmPasswordErrorMessage : undefined
        }, 
        successMessages() {
            return this.successMessage ? this.successMessage : undefined
        }
    },
    methods: {
        // update user information
        updateUserInfo() {
            this.loading = true // loading for update profile button
            this.updateAvatar() // call a function
            
            if(this.$refs.form.validate()) { // check form validate    
                this.updateInfo()  // call a function
                this.passwordValidation() // call a function
            }
        },
        // update user avatar
        updateAvatar() {
            if(this.fileRecord[0] && this.fileRecord[0].error == false) { // check if has file & no error
                let file = this.fileRecord[0].file // get file
                let fileExt = file.name.split('.').pop() // split file extension
                let fileName = this.$store.state.user.data.uid + '.' + fileExt // make a file name
                let storageRef = firebase.storage().ref('avatars/' + fileName)
                
                // put file to firebase storage
                storageRef.put(file).then(res => {
                    res.ref.getDownloadURL().then((imageUrl) => { // get file url
                        // update file url
                        db.collection("users").doc(this.$store.state.user.data.uid).update({
                            avatar: imageUrl,
                        }).then(() => {
                            this.loading = false
                        }).catch(err => console.log(err))
                    })
                })
            }
        },
         // update user information
        updateInfo() {
            db.collection("users").doc(this.$store.state.user.data.uid).update({ // get user uid form vuex store
                // update data and set to data property
                name: this.name,
                bio: this.bio,
                facebookUrl: this.facebookUrl,
                twitterUrl: this.twitterUrl,
                instagramUrl: this.instagramUrl,
                pinterestUrl: this.pinterestUrl,
                githubUrl: this.githubUrl
            }).then(() => {
                if(!this.oldPassword && !this.newPassword) { // check old password and new password not exist
                    this.snackbar = true // vuetify snackbar
                    this.loading = false // loading button for update profile
                }
            }).catch(err => console.log(err))
        },
        // user password validation and update password
        passwordValidation() {
            if(this.oldPassword) { // if has old password
                var user = firebase.auth().currentUser // get current user from firebase auth
                var credential = firebase.auth.EmailAuthProvider.credential(
                    firebase.auth().currentUser.email,
                    this.oldPassword
                )
                user.reauthenticateWithCredential(credential).then(() => {
                    this.oldPasswordErrorMessage = ""
                    if(this.newPassword) {
                        if(this.newPassword.length < 8) { // check password length
                            this.newPasswordErrorMessage = "Password must be at least 8 characters" // set error message
                        }else {
                            this.newPasswordErrorMessage = "" 
                            if(this.newPassword == this.confirmPassword) {
                                this.confirmPasswordErrorMessage = ""
                                user.updatePassword(this.newPassword).then(() => {
                                    this.snackbar = true // vuetify snackbar
                                    this.loading = false // vuetify loading
                                    this.oldPassword = ""
                                    this.newPassword = ""
                                    this.confirmPassword = ""
                                }).catch((error) => {
                                    this.newPasswordErrorMessage = error.message // set error message
                                })
                            }else {
                                this.confirmPasswordErrorMessage = "Password confirmation does not match" // set error message
                            }
                        }
                    }
                }).catch((error) => {
                    this.loading = false
                    this.oldPasswordErrorMessage = error.message // set error message
                });
            }
        },
        // check username exist or not. if username not exist then update username
        checkUsername() {
            if(!/^[a-z]+$/.test(this.username)) { // check lowercase letter
                this.errorMessage = "Username must be lowercase letter"
            }else {
                db.collection('users').where('username', '==', this.username).get()
                .then(snapshot => {
                    if(!snapshot.empty) { // check empty
                        this.successMessage = ""
                        this.errorMessage = "The username already exists" // set error message
                    }else {
                        if(this.$refs.form.validate()) {
                            db.collection("users").doc(this.$store.state.user.data.uid).update({ // get user uid from vuex store
                                username: this.username
                            }).then(() => {
                                this.errorMessage = ""
                                this.successMessage = "Username has been updated" // set success message
                            }).catch(err => console.log(err))
                        }else {
                            this.errorMessage = ""
                            this.successMessage = ""
                        }
                    }
                })
            }
        },
        // check user bio length
        bioMinLengthCheck() {
            if(this.bio.length < 75) { // check length < 75
                this.bioErrorMessage = "Min 75 characters" // set error message
            }else {
                this.bioErrorMessage = ""
            }
        },
        // check confirm password 
        confirmPasswordCheck() {
            if(this.newPassword) {
                if(this.newPassword != this.confirmPassword) { // check new password equal confirm password
                    this.confirmPasswordErrorMessage = "Password confirmation does not match" // set error message
                }else {
                    this.confirmPasswordErrorMessage = ""
                }
            }
        }
    }
}
</script>

<style scoped>
/* Dark & Light theme input, textarea color */
.settings .theme--light .v-input--is-focused input, .theme--light .v-input--is-focused textarea {
    color: white !important;
}
.settings .theme--light .v-input input, .theme--light .v-input textarea {
    color: black;
}
.settings .theme--dark .v-input--is-focused input, .theme--dark .v-input--is-focused textarea {
    color: black !important;
}
.settings .theme--dark.v-input input, .theme--dark.v-input textarea {
    color: white;
}
</style>