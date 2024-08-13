import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import redis from "../../../../../redis/redis";

export async function POST(req:NextRequest) {
    const cookie = cookies();
    const refreshToken = cookie.get('refreshToken')?.value;

    redis.set(`blackList:${refreshToken}`, 'blackList'); // 로그아웃시 발금된 refreshToken 블랙리스트 등록

    cookie.delete('refreshToken');

    return new NextResponse(JSON.stringify({message: "로그아웃"}))
}
