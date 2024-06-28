"use client"
import React, { useState } from 'react'
import Heading from '../headersComponent/Heading'
import SubHeading from '../headersComponent/SubHeading'
import { LabelInputContainer } from '../inputContainer/InputConatiner'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import Otpbutton from '../cards/Otpbutton'
import Button from '../buttons/Button'
import Line from '../effects/Line'

const ForgotPassword = () => {

    const [email, setEmail] = useState("")
  return (
    <>
        <div className="w-full h-screen flex justify-center items-center">
            <div className='bg-black p-5 w-96 rounded-lg'>
                <Heading value={'Reset your Password'}/>
                <SubHeading value={'We will send you a OTP via Email'}/>
                <LabelInputContainer className="mb-4 mt-8">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        onChange={ (e) => {setEmail(e.target.value)}}
                        id="email"
                        placeholder="notewrite.bvcoenm@gmail.com"
                        type="email"
                    />
                </LabelInputContainer>

                <div className='w-full p-2  bg-neutral-800  rounded-lg flex justify-center gap-3 mb-9'>
                    <Otpbutton/>
                    <Otpbutton/>
                    <Otpbutton/>
                    <Otpbutton/>
                    <Otpbutton/>
                    <Otpbutton/>
                </div>
                <Line/>
                <Button value={`Reset Password` }/>

            </div>
        </div>
    </>
  )
}

export default ForgotPassword
