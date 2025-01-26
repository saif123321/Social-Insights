import {
  StyleSheet,
} from 'react-native';
import { height, width } from '../../../App';

export const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#E6F4F1',
    flex: 1,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  tinyLogo: {
    width: width * 50,
    height: height * 15,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  groupInput: {
    marginVertical: 5,
    marginBottom: 10,
    height: 7 * height,
    alignSelf: 'stretch',
    paddingLeft: 10,
    // marginHorizontal: 8 * width,
    borderColor: 'grey',
    borderWidth: 0.5,
    backgroundColor: 'white',
    // fontWeight: 'bold',
    shadowColor: '#9C9C9C',
    borderRadius: 7,
    elevation: 4,
    overflow: 'hidden',
    borderRadius: 7,
  },
  searchWrapper: {
    marginLeft: 10,
    width: 80 * width
  },
  input: {
    marginVertical: 10,
    height: 7 * height,
    alignSelf: 'stretch',
    paddingLeft: 10,
    marginHorizontal: 8 * width,
    borderColor: 'grey',
    borderWidth: 0.5,
    backgroundColor: 'white',
    fontWeight: 'bold',
    shadowColor: '#9C9C9C',
    borderRadius: 7,
    elevation: 4,
    overflow: 'hidden',
  },
  searchInput: {
    marginVertical: 10,
    height: 6 * height,
    // alignSelf: 'stretch',
    // paddingLeft: 10,
    // marginHorizontal: 8 * width,
    // borderColor: 'red',
    // borderWidth: 0.5,
    backgroundColor: 'white',
    fontWeight: 'bold',
    shadowColor: '#9C9C9C',
    elevation: 4,
    overflow: 'hidden',
    borderRadius: 20,
  },
  headerLogo: {
    width: width * 40, height: height * 10, marginRight: 10, resizeMode: 'contain', borderRadius: 10
  },
  navigationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 70, backgroundColor: '#E6F4F1' },
  button: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#438f7f',
    padding: 10,
    borderRadius: 10,
  },
  createBtn: {
    width: width * 40,
    alignItems: 'center',
    backgroundColor: '#438f7f',
    padding: 10,
    borderRadius: 10,
  },
  createBtnAdd: {
    alignItems: 'center',
    backgroundColor: '#438f7f',
    padding: 10,
    borderRadius: 10,
  },
  joinBtn: {
    width: width * 40,
    marginLeft: 10,
    alignItems: 'center',
    backgroundColor: '#438f7f',
    padding: 10,
    borderRadius: 10,
  },
  welcome: {
    fontSize: 30,
    margin: 10,
    fontWeight: '900',
    color: 'black',
  },
  Buttontext: {
    color: 'white',
    fontWeight: '900',
  },
  flatlist: {
    flex: 1,
    alignContent: 'center',
  },
  forgotTitle: {
    fontWeight: '800',
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: 'right',
    paddingTop: 5,
    paddingBottom: 10,
    color: 'black',
  },
  tagLineTextIsignin: {
    marginVertical: 10,
    textAlign: 'center',
    // opacity: 0.7
  },
  loginSocialBtn: {
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 44,
    color: 'red',
    borderWidth: 1,
    borderColor: '#438f7f',
  },
  btnSocialText: {
    color: '#438f7f',
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    // marginTop: 5,
    marginHorizontal: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 10,
    marginLeft: 10,
  },
  imgthumbnail: {
    width: width * 50,
    height: height * 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },
  productData: {
    alignSelf: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  productIndiv: {
    fontWeight: '800',
  },
  productListing: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
  },
  productImage: {
    width: width * 10,
    height: height * 5,
    borderRadius: 50,
  },
  headingPage: {
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 26,
    paddingHorizontal: 20,
    color: 'black'
  },
  container: {
    flex: 1, padding: 10, backgroundColor: '#E6F4F1',
    //  height : '100%'
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 2,
    paddingHorizontal: 20
  },
  section: {
    padding: 10,
    alignSelf: 'center',

  },
  LoginTitle: {
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 22,
    color: 'black'

  },
  batchCoursesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: width - 20,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  batchCourses: {
    backgroundColor: '#222222',
    width: width * 46,
    height: height * 28,
    borderRadius: 15,
    marginVertical: 5,
  },

  imageContainer: {
    position: 'absolute',
    right: 0,
    borderRadius: 10,
    overflow: 'hidden',
  },
  batchCourseInstructor: {
    width: width * 30,
    height: height * 15,
    resizeMode: 'contain',
    borderRadius: 50,
    top: -26,
    left: 25,
  },
  batchCourseTitle: {
    color: 'white',
    fontWeight: '700',
  },
  batchCourseInfo: {
    position: 'absolute',
    bottom: 5,
    width: width * 40,
    marginHorizontal: 10,
  },
  batchModulesInfo: {
    top: 100,
    marginHorizontal: 10,
  },
  progressBar: {
    color: 'green',
    // backgroundColor: '#f2f2f2',
    borderRadius: 50,
    marginVertical: 10,

  },
  batchCourseCompletionTitle: {
    color: 'white',
    marginLeft: 'auto',
    fontSize: 13,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: 'black',
  },
  pageTitletagLine: {
    fontWeight: '800',
    color: 'red',
    fontSize: 13,
  },
  moduleTitle: {
    fontWeight: '700',
    color: 'black',
    top: 40,
  },
  batchCoursesModule: {
    backgroundColor: '#fefefe',
    width: width * 45,
    margin: 5,
    height: height * 25,
    borderRadius: 15,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderRadius: 10,
    elevation: 3,
  },
  pageTitleChapter: {
    fontWeight: '800',
    color: '#ffc100',
    fontSize: 15,
  },
  imgInstructorthumbnail: {
    width: width * 20,
    height: height * 10,
    borderRadius: 50,
  },
  instructorWrapperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  chapterWrapperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    backgroundColor: '#fefefe',
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderRadius: 10,
    elevation: 3,
  },
  profilePicture: {
    backgroundColor: '#438f7f',
    color: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginRight: 10
  },
  usageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  instructorTitle: {
    marginHorizontal: 10,
    fontSize: 15,
  },
  suggestionsWrapper: {
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 150,
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 1
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    color : 'black'
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffc100',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 'auto',

  },
  courseChapterNO: {
    backgroundColor: '#438f7f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: 'white',
    borderRadius: 10,
    fontSize: 20,
    fontWeight: '800',
  },
  courseChaptername: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
  },
  textHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: 'black'

  },
  UsageBtn: {
    width: width * 30,
    marginLeft: 'auto',
    alignItems: 'center',
    backgroundColor: '#438f7f',
    padding: 10,
    borderRadius: 10,
  },
  FlatListTopicsContainer: {
    height: height * 65,
  },
  topicsList: {
    backgroundColor: '#d3d5d3',
    borderRadius: 10,
    padding: 3,
    margin: 3,

  },
  vimeoPlayer: {
    height: height * 25,
    backgroundColor: 'transparent',
  },
  startQuizBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#ffc100',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: width * 10,
    marginVertical: 10,
  },
  fixedButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  fixedStartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D0D0D0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffc107',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  pdf: {
    flex: 1,
    width: width,
    height: height,
  },
  quiz_title: {
    fontSize: 20,
    fontWeight: '900',
    color: 'black',
  },
  quiz_body: {
    paddingVertical: 20,
  },
  hide: {
    opacity: 0,
  },
  submitBtn: {
    alignItems: 'center',
    backgroundColor: '#ffc107',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: width * 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  LogoutBtn: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'grey', padding: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  retakeQuiz: {
    alignItems: 'center',
    backgroundColor: '#ffc100',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10,
  },
  showResult: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffc107',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  mathEq: {
    backgroundColor: 'transparent',
    width: width * 80,
  },
  success: {
    marginBottom: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#67d16b',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'green',
  },
  danger: {
    borderRadius: 5,
    flexDirection: 'row',
    backgroundColor: '#e37e7e',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'red',
  },
  menuBtnLink: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: 'grey', padding: 10, },
  inputAndroidContainer: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },

  downloadBtn: {
    margin: 10,
    flexDirection: 'row',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    zIndex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    right: 0
  },
  videoPlayer: {
    height: '50%',
  },
  progressContainer: {
    padding: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    borderRadius: 10,
    elevation: 1,
  },
  successBtn: {
    paddingHorizontal: 50, paddingVertical: 5, backgroundColor: '#ffc107', borderRadius: 12, margin: 5
  },
  greyBtn: {
    paddingHorizontal: 50, paddingVertical: 5, backgroundColor: '#d3d5d3', borderRadius: 12, margin: 5
  },
  whiteText: { fontWeight: '900', color: 'white' },
  blackText: { fontWeight: '900', color: 'black' }
}
);