import { TEST_DISPATH } from "./types";
// Register User
export const registerUser = (userData) => {
    return {
        type: TEST_DISPATH,
        payload: userData
    }
};