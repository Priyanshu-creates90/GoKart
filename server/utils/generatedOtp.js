const generatedOtp = ()=>{
    return Math.floor(Math.random() * 900000) + 100000  /// 100000 to 999999
}
export default generatedOtp     //math.random => 0 to 1 (0 inclusive & 1 exclusive)