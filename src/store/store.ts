import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import teacherReducer from "../features/teacher/teacherSlice";
import studentReducer from "../features/student/studentSlice";
import classReducer from "../features/class/classSlice";
import timetableReducer from "../features/timetable/timetableSlice";
import liveClassReducer from "../features/liveClass/liveClassSlice";
import sectionReducer from "../features/section/sectionSlice";
import subjectReducer from "../features/subject/subjectSlice";
import lectureSlotReducer from "../features/lectureSlot/lectureSlotSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    teacher: teacherReducer,
    student: studentReducer,
    class: classReducer,
    lectureSlot: lectureSlotReducer,
    section: sectionReducer,
    subject: subjectReducer,
    timetable: timetableReducer,
    liveClass: liveClassReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
