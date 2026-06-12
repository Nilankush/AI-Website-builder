"use client"

import { UserDetailsContext } from "@/context/userDetailContext"
import { api } from "@/convex/_generated/api";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMutation } from "convex/react";
import { useContext, useState } from "react"

interface pricingOptionSchema{
    name: string;
    tokens: string;
    value: number;
    desc: string;
    price: number;
};

export default function Pricing(){

    const PRICING_OPTIONS: pricingOptionSchema[] = [
        {
          name:'Basic',
          tokens:'50K',
          value:50000,
          desc:'Ideal for hobbyists and casual users for light, exploratory use.',
          price:5
        },
        {
          name:'Starter',
          tokens:'120K',
          value:120000,
          desc:'Designed for professionals who need to use Bolt a few times per week.',
          price:10
        },
        {
          name:'Pro',
          tokens:'2.5M',
          value:2500000,
          desc:'Designed for professionals who need to use Bolt a few times per week.',
          price:20
        },
        {
          name:'Unlimted (License)',
          tokens:'Unlimited',
          value:999999999,
          desc:'Designed for professionals who need to use Bolt a few times per week.',
          price:50
        }]

      const[options, setOptions] = useState<pricingOptionSchema>();
      const userDetailsContext = useContext(UserDetailsContext);
      const updateToken = useMutation(api.users.updateToken);

      if(!userDetailsContext){
        throw new Error("UserDetailsContext is empty.");
      };

      const {userDetails, setUserDetails} = userDetailsContext;

      const onSuccess = async() => {
        const token: number = userDetails?.token + Number(options?.value);

        await updateToken({
            userId: userDetails?._id,
            token: token
        });
        setUserDetails({...userDetails,token})
      };

    return(
        <div className="flex flex-col items-center mt-25 md:mt-30 p-10 border-2 rounded-2xl mx-5 mb-5 md:mb-0">
            <div className="flex flex-col items-center">
                <h1 className="text-5xl font-semibold">Pricing</h1>
                <h2 className="mt-5 text-sm">Start with a free account to speed up your workflow on 
                    public projects or boost your entire team with instantly-opening production environments.
                </h2>
            </div>
            <div className="w-full flex items-center justify-between border p-5 mt-2 text-accent-foreground text-sm font-semibold">
                <h1 className="">My tokens{" "}:{" "}<span className="text-cyan-300 bg-cyan-300/10 rounded-xl p-0.5">{userDetails?.token}</span></h1>
                <h2>
                    Need more tokens?<br/>
                      Purchase tokens at your convinience.
                </h2>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {PRICING_OPTIONS.map((option, index)=>(
                    <div key={index} className="border p-4 flex-col rounded-2xl">
                        <h1 className="text-2xl font-bold">{option.name}</h1>
                        <p className="text-sm">
                            Tokens{" "}:{" "}
                            <span className="rounded-2xl p-1 font-semibold text-cyan-300 bg-cyan-300/10">{option.tokens}</span>
                        </p>
                        <p className="w-full text-sm flex justify-center p-5">{option.desc}</p>
                        <h1 className="w-full border text-3xl font-bold flex justify-center p-5 mb-3">${option.price}</h1>
                        <PayPalButtons 
                        onClick={()=>setOptions(option)}
                        onApprove={onSuccess}
                        onCancel={()=>alert("Payment failed")}
                        style={{layout: "horizontal", label: "checkout"}}
                        createOrder={(data,actions)=>{
                            return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [{
                                    amount: {
                                        value: JSON.stringify(option.price),
                                        currency_code: "USD"
                                    }
                                }]
                            })
                        }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
};