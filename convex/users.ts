import { v } from "convex/values";
import { mutation, query } from "../convex/_generated/server";

export const createUser = mutation({
    args:{
        name: v.string(),
        email: v.string(),
        picture: v.string(),
        token: v.number()
    },
    handler: async(ctx,args)=>{
        //whether user exists
        const user = await ctx.db.query("users").filter((q)=>q.eq(q.field("email"),args.email)).collect();

        //if new user
        if(user.length === 0){
            const id = await ctx.db.insert("users",{
                name: args.name,
                email: args.email,
                picture: args.picture,
                token: args.token
            });
            console.log(id);
            return id;
        };
        return user[0]._id;
    }
});

export const getUser = query({
    args:{
        email: v.string()
    },
    handler: async(ctx,args)=>{
        const user = await ctx.db.query("users").filter((q)=>q.eq(q.field("email"),args.email)).collect();
        return user[0];
    }
})

export const updateToken = mutation({
    args:{
        userId: v.id("users"),
        token: v.number()
    },
    handler: async(ctx, args)=>{
        const result = await ctx.db.patch(args.userId,{
            token: args.token
        });
        return result;
    }
})

