import { useState } from "react";
import "./GrowthDungeon.css";

const dungeonList = [
  {
    id: 1,
    name: "불의 원소 던전",
    image: "/성장던전/선택/불의원소.png",
    bg: "/성장던전/배경/불의원소.png",
    rewardsByStage: [
      "EXP: 450, 골드: 1400, 불의 원소 하급: 5",
      "EXP: 500, 골드: 1600, 불의 원소 하급: 10",
      "EXP: 550, 골드: 1800, 불의 원소 하급: 20",
      "EXP: 600, 골드: 2000, 불의 원소 중급: 5",
      "EXP: 650, 골드: 2200, 불의 원소 중급: 10",
      "EXP: 700, 골드: 2400, 불의 원소 중급: 15",
      "EXP: 750, 골드: 2600, 불의 원소 상급: 5",
      "EXP: 800, 골드: 2800, 불의 원소 상급: 10",
      "EXP: 850, 골드: 3000, 불의 원소 상급: 15",
      "EXP: 900, 골드: 3200, 불의 원소 상급: 20",
    ],
    bossStatsByStage: [
      {
        atk: 174, //공격
        def: 65, //방어
        hp: 7886, //체력
        spd: 13, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 274, //공격
        def: 92, //방어
        hp: 15609, //체력
        spd: 16, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 345, //공격
        def: 131, //방어
        hp: 23432, //체력
        spd: 18, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 475, //공격
        def: 178, //방어
        hp: 38229, //체력
        spd: 20, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 524, //공격
        def: 196, //방어
        hp: 44602, //체력
        spd: 23, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 15, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 728, //공격
        def: 266, //방어
        hp: 64007, //체력
        spd: 26, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 30, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 870, //공격
        def: 322, //방어
        hp: 86719, //체력
        spd: 29, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 60, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 1160, //공격
        def: 440, //방어
        hp: 117768, //체력
        spd: 32, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 90, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 1819, //공격
        def: 697, //방어
        hp: 183997, //체력
        spd: 35, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 100, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 2445, //공격
        def: 938, //방어
        hp: 230432, //체력
        spd: 38, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 100, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
    ],
  },
  {
    id: 2,
    name: "물의 원소 던전",
    image: "/성장던전/선택/물의원소.png",
    bg: "/성장던전/배경/물의원소.png",
    rewardsByStage: [
      "EXP: 450, 골드: 1400, 물의 원소 하급: 5",
      "EXP: 500, 골드: 1600, 물의 원소 하급: 10",
      "EXP: 550, 골드: 1800, 물의 원소 하급: 20",
      "EXP: 600, 골드: 2000, 물의 원소 중급: 5",
      "EXP: 650, 골드: 2200, 물의 원소 중급: 10",
      "EXP: 700, 골드: 2400, 물의 원소 중급: 15",
      "EXP: 750, 골드: 2600, 물의 원소 상급: 5",
      "EXP: 800, 골드: 2800, 물의 원소 상급: 10",
      "EXP: 850, 골드: 3000, 물의 원소 상급: 15",
      "EXP: 900, 골드: 3200, 물의 원소 상급: 20",
    ],
    bossStatsByStage: [
      {
        atk: 174, //공격
        def: 65, //방어
        hp: 7886, //체력
        spd: 13, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 274, //공격
        def: 92, //방어
        hp: 15609, //체력
        spd: 16, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 345, //공격
        def: 131, //방어
        hp: 23432, //체력
        spd: 18, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 475, //공격
        def: 178, //방어
        hp: 38229, //체력
        spd: 20, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 524, //공격
        def: 196, //방어
        hp: 44602, //체력
        spd: 23, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 15, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 728, //공격
        def: 266, //방어
        hp: 64007, //체력
        spd: 26, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 30, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 870, //공격
        def: 322, //방어
        hp: 86719, //체력
        spd: 29, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 60, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 1160, //공격
        def: 440, //방어
        hp: 117768, //체력
        spd: 32, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 90, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 1819, //공격
        def: 697, //방어
        hp: 183997, //체력
        spd: 35, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 100, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 2445, //공격
        def: 938, //방어
        hp: 230432, //체력
        spd: 38, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 100, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
    ],
  },
  {
    id: 3,
    name: "땅의 원소 던전",
    image: "/성장던전/선택/땅의원소.png",
    bg: "/성장던전/배경/땅의원소.png",
    rewardsByStage: [
      "EXP: 450, 골드: 1400, 땅의 원소 하급: 5",
      "EXP: 500, 골드: 1600, 땅의 원소 하급: 10",
      "EXP: 550, 골드: 1800, 땅의 원소 하급: 20",
      "EXP: 600, 골드: 2000, 땅의 원소 중급: 5",
      "EXP: 650, 골드: 2200, 땅의 원소 중급: 10",
      "EXP: 700, 골드: 2400, 땅의 원소 중급: 15",
      "EXP: 750, 골드: 2600, 땅의 원소 상급: 5",
      "EXP: 800, 골드: 2800, 땅의 원소 상급: 10",
      "EXP: 850, 골드: 3000, 땅의 원소 상급: 15",
      "EXP: 900, 골드: 3200, 땅의 원소 상급: 20",
    ],
    bossStatsByStage: [
      {
        atk: 81, //공격
        def: 96, //방어
        hp: 11366, //체력
        spd: 8, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 115, //공격
        def: 136, //방어
        hp: 22506, //체력
        spd: 9, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 161, //공격
        def: 191, //방어
        hp: 33795, //체력
        spd: 10, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 218, //공격
        def: 276, //방어
        hp: 55480, //체력
        spd: 11, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 240, //공격
        def: 304, //방어
        hp: 64726, //체력
        spd: 12, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 15, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 338, //공격
        def: 435, //방어
        hp: 93350, //체력
        spd: 14, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 30, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 407, //공격
        def: 519, //방어
        hp: 126332, //체력
        spd: 17, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 60, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 592, //공격
        def: 684, //방어
        hp: 169753, //체력
        spd: 20, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 90, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 923, //공격
        def: 1070, //방어
        hp: 265038, //체력
        spd: 23, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 100, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 1240, //공격
        def: 1440, //방어
        hp: 331927, //체력
        spd: 38, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 100, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
    ],
  },
  {
    id: 4,
    name: "빛의 원소 던전",
    image: "/성장던전/선택/빛의원소.png",
    bg: "/성장던전/배경/빛의원소.png",
    rewardsByStage: [
      "EXP: 450, 골드: 1400, 빛의 원소 하급: 5",
      "EXP: 500, 골드: 1600, 빛의 원소 하급: 10",
      "EXP: 550, 골드: 1800, 빛의 원소 하급: 20",
      "EXP: 600, 골드: 2000, 빛의 원소 중급: 5",
      "EXP: 650, 골드: 2200, 빛의 원소 중급: 10",
      "EXP: 700, 골드: 2400, 빛의 원소 중급: 15",
      "EXP: 750, 골드: 2600, 빛의 원소 상급: 5",
      "EXP: 800, 골드: 2800, 빛의 원소 상급: 10",
      "EXP: 850, 골드: 3000, 빛의 원소 상급: 15",
      "EXP: 900, 골드: 3200, 빛의 원소 상급: 20",
    ],
    bossStatsByStage: [
      {
        atk: 191, //공격
        def: 79, //방어
        hp: 521, //체력
        spd: 6, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 271, //공격
        def: 113, //방어
        hp: 1034, //체력
        spd: 7, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 377, //공격
        def: 158, //방어
        hp: 1553, //체력
        spd: 8, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 515, //공격
        def: 212, //방어
        hp: 2572, //체력
        spd: 9, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 568, //공격
        def: 234, //방어
        hp: 3001, //체력
        spd: 10, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 15, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 782, //공격
        def: 332, //방어
        hp: 4304, //체력
        spd: 12, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 30, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 940, //공격
        def: 399, //방어
        hp: 5827, //체력
        spd: 15, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 60, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 1295, //공격
        def: 525, //방어
        hp: 7891, //체력
        spd: 18, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 90, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 2034, //공격
        def: 827, //방어
        hp: 12313, //체력
        spd: 21, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 100, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 2733, //공격
        def: 1112, //방어
        hp: 15420, //체력
        spd: 24, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 100, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
    ],
  },
  {
    id: 5,
    name: "암흑의 원소 던전",
    image: "/성장던전/선택/암흑의원소.png",
    bg: "/성장던전/배경/암흑의원소.png",
    rewardsByStage: [
      "EXP: 450, 골드: 1400, 암흑의 원소 하급: 5",
      "EXP: 500, 골드: 1600, 암흑의 원소 하급: 10",
      "EXP: 550, 골드: 1800, 암흑의 원소 하급: 20",
      "EXP: 600, 골드: 2000, 암흑의 원소 중급: 5",
      "EXP: 650, 골드: 2200, 암흑의 원소 중급: 10",
      "EXP: 700, 골드: 2400, 암흑의 원소 중급: 15",
      "EXP: 750, 골드: 2600, 암흑의 원소 상급: 5",
      "EXP: 800, 골드: 2800, 암흑의 원소 상급: 10",
      "EXP: 850, 골드: 3000, 암흑의 원소 상급: 15",
      "EXP: 900, 골드: 3200, 암흑의 원소 상급: 20",
    ],
    bossStatsByStage: [
      {
        atk: 157, //공격
        def: 78, //방어
        hp: 8571, //체력
        spd: 10, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 222, //공격
        def: 111, //방어
        hp: 17017, //체력
        spd: 12, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 310, //공격
        def: 154, //방어
        hp: 25628, //체력
        spd: 13, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 412, //공격
        def: 207, //방어
        hp: 42981, //체력
        spd: 14, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 454, //공격
        def: 228, //방어
        hp: 50146, //체력
        spd: 15, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 15, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 627, //공격
        def: 326, //방어
        hp: 72415, //체력
        spd: 16, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 30, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 751, //공격
        def: 387, //방어
        hp: 97915, //체력
        spd: 19, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 60, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 1033, //공격
        def: 515, //방어
        hp: 131077, //체력
        spd: 22, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 90, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 1621, //공격
        def: 806, //방어
        hp: 204576, //체력
        spd: 25, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 100, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 2180, //공격
        def: 1085, //방어
        hp: 256205, //체력
        spd: 28, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 100, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
    ],
  },
  {
    id: 6,
    name: "골드 던전",
    image: "/성장던전/선택/골드.png",
    bg: "/성장던전/배경/골드.png",
    rewardsByStage: [
      "EXP: 450, 골드: 50000",
      "EXP: 500, 골드: 60000",
      "EXP: 550, 골드: 70000",
      "EXP: 600, 골드: 80000",
      "EXP: 650, 골드: 100000",
      "EXP: 700, 골드: 120000",
      "EXP: 750, 골드: 150000",
      "EXP: 800, 골드: 180000",
      "EXP: 850, 골드: 210000",
      "EXP: 900, 골드: 250000",
    ],
    bossStatsByStage: [
      {
        atk: 1292, //공격
        def: 559, //방어
        hp: 19304, //체력
        spd: 8, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 1576, //공격
        def: 642, //방어
        hp: 25289, //체력
        spd: 9, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 1923, //공격
        def: 739, //방어
        hp: 36141, //체력
        spd: 10, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 2345, //공격
        def: 850, //방어
        hp: 47343, //체력
        spd: 1, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 0, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 2861, //공격
        def: 977, //방어
        hp: 67187, //체력
        spd: 12, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 15, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 3490, //공격
        def: 1124, //방어
        hp: 88015, //체력
        spd: 14, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 30, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 4258, //공격
        def: 1293, //방어
        hp: 124169, //체력
        spd: 17, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 60, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 5194, //공격
        def: 1486, //방어
        hp: 162661, //체력
        spd: 20, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 90, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 6337, //공격
        def: 1709, //방어
        hp: 228306, //체력
        spd: 23, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 100, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
      {
        atk: 7731, //공격
        def: 1966, //방어
        hp: 299081, //체력
        spd: 26, //속공
        critRate: 5, //치확
        critDmg: 150, //치뎀
        acc: 100, //효과 적중
        weakHit: 0, //약공확
        block: 0, //막확
        dmgReduction: 0, //받피감
        res: 0, //효과 저항
      },
    ],
  },
];

export default function GrowthDungeon() {
  const [selectedId, setSelectedId] = useState(1);
  const [selectedStage, setSelectedStage] = useState(1);

  const selectedDungeon = dungeonList.find((d) => d.id === selectedId);
  const boss = selectedDungeon.bossStatsByStage?.[selectedStage - 1];

  return (
    <div className="growth-container page">
      <div className="dungeon-list">
        {dungeonList.map((dungeon) => (
          <div
            key={dungeon.id}
            className={`dungeon-tab ${
              dungeon.id === selectedId ? "active" : ""
            }`}
            onClick={() => {
              setSelectedId(dungeon.id);
              setSelectedStage(1);
            }}
            style={{
              backgroundImage: `url(${dungeon.image})`,
            }}
          ></div>
        ))}
      </div>

      <div className="dungeon-detail">
        <div className="dungeon-info">
          <div className="dungeon-top">
            <div className="dungeon-image">
              <img src={selectedDungeon.bg} alt="보스 이미지" />
            </div>

            {boss && (
              <div className="boss-stats-box">
                <div className="boss-stat-list two-column">
                  <div>
                    <div>
                      <strong>
                        {["물의 원소 던전", "빛의 원소 던전"].includes(
                          selectedDungeon.name
                        )
                          ? "마법 공격력"
                          : "물리 공격력"}
                        :
                      </strong>{" "}
                      {boss.atk.toLocaleString()}
                    </div>

                    <div>
                      <strong>방어력:</strong> {boss.def.toLocaleString()}
                    </div>
                    <div>
                      <strong>생명력:</strong> {boss.hp.toLocaleString()}
                    </div>
                    <div>
                      <strong>속공:</strong> {boss.spd}
                    </div>
                    <div>
                      <strong>치명타 확률:</strong> {boss.critRate}%
                    </div>
                    <div>
                      <strong>치명타 피해:</strong> {boss.critDmg}%
                    </div>
                  </div>
                  <div>
                    <div>
                      <strong>약점 공격 확률:</strong> {boss.weakHit}%
                    </div>
                    <div>
                      <strong>막기 확률:</strong> {boss.block}%
                    </div>
                    <div>
                      <strong>받는 피해 감소:</strong> {boss.dmgReduction}%
                    </div>
                    <div>
                      <strong>효과 적중:</strong> {boss.acc}%
                    </div>
                    <div>
                      <strong>효과 저항:</strong> {boss.res}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="dungeon-bottom">
            <div className="stage">
              <p>단계 선택</p>
              <div className="stage-select">
                {[...Array(10)].map((_, i) => (
                  <button
                    key={i}
                    className={selectedStage === i + 1 ? "active" : ""}
                    onClick={() => setSelectedStage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="reward-section">
              <p>획득 가능 보상</p>
              <div className="reward-text">
                {(
                  selectedDungeon.rewardsByStage?.[selectedStage - 1] ||
                  "보상 정보 없음"
                )
                  .split(",")
                  .map((part, index) => (
                    <div key={index}>{part.trim()}</div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
