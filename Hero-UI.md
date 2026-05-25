<!DOCTYPE html>

<html class="scroll-smooth" lang="zh-TW"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Soul Oasis 心靈綠洲 | 當心裡很亂，先讓我們陪你整理</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=Noto+Sans+TC:wght@300;400;500;700&amp;family=Noto+Sans:wght@400;500;700&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                "tertiary-fixed-dim": "#d5c5a8",
                "primary-container": "#a3b18a",
                "secondary-fixed": "#dfe4e0",
                "on-primary-fixed-variant": "#3f4b2c",
                "secondary": "#5a605d",
                "surface-container": "#f0eee9",
                "inverse-primary": "#becca3",
                "on-primary": "#ffffff",
                "surface-container-highest": "#e4e2dd",
                "error": "#ba1a1a",
                "on-background": "#1b1c19",
                "surface-variant": "#e4e2dd",
                "tertiary": "#695d46",
                "tertiary-container": "#b9aa8f",
                "background": "#fbf9f4",
                "on-surface": "#1b1c19",
                "surface-bright": "#fbf9f4",
                "on-error": "#ffffff",
                "inverse-on-surface": "#f2f1ec",
                "surface-container-low": "#f5f3ee",
                "surface-tint": "#566342",
                "surface-dim": "#dbdad5",
                "outline-variant": "#c6c8bb",
                "secondary-container": "#dfe4e0",
                "on-tertiary-container": "#493f29",
                "on-surface-variant": "#45483f",
                "outline": "#76786e",
                "surface": "#fbf9f4",
                "on-tertiary-fixed-variant": "#504530",
                "secondary-fixed-dim": "#c3c8c4",
                "on-primary-container": "#384425",
                "tertiary-fixed": "#f2e0c3",
                "error-container": "#ffdad6",
                "primary-fixed-dim": "#becca3",
                "on-secondary": "#ffffff",
                "primary-fixed": "#dae8be",
                "primary": "#566342",
                "on-secondary-fixed": "#171d1a",
                "on-secondary-fixed-variant": "#434845",
                "on-tertiary-fixed": "#231a08",
                "surface-container-lowest": "#ffffff",
                "surface-container-high": "#eae8e3",
                "on-tertiary": "#ffffff",
                "inverse-surface": "#30312e",
                "on-error-container": "#93000a",
                "on-primary-fixed": "#141f05",
                "on-secondary-container": "#606662"
            },
            "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            "spacing": {
                "element-gap": "16px",
                "margin-desktop": "80px",
                "margin-mobile": "24px",
                "section-gap": "120px",
                "gutter": "24px"
            },
            "fontFamily": {
                "label-sm": ["Plus Jakarta Sans", "Noto Sans TC"],
                "headline-lg": ["Plus Jakarta Sans", "Noto Sans TC"],
                "display-lg": ["Plus Jakarta Sans", "Noto Sans TC"],
                "headline-lg-mobile": ["Plus Jakarta Sans", "Noto Sans TC"],
                "body-md": ["Noto Sans", "Noto Sans TC"]
            },
            "fontSize": {
                "label-sm": ["14px", {"lineHeight": "1.4", "letterSpacing": "0.05em", "fontWeight": "500"}],
                "headline-lg": ["32px", {"lineHeight": "1.3", "fontWeight": "500"}],
                "display-lg": ["48px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                "headline-lg-mobile": ["28px", {"lineHeight": "1.3", "fontWeight": "500"}],
                "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        .soft-shadow {
            box-shadow: 0 30px 60px -12px rgba(163, 177, 138, 0.08);
        }
        .hero-gradient {
            background: radial-gradient(circle at 70% 30%, rgba(163, 177, 138, 0.15) 0%, rgba(251, 249, 244, 0) 70%);
        }
        .floating {
            animation: floating 6s ease-in-out infinite;
        }
        @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md selection:bg-primary-container selection:text-on-primary-container">
<!-- TopNavBar -->
<nav class="sticky top-0 w-full z-50 bg-background/80 backdrop-blur-md">
<div class="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto">
<div class="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                Soul Oasis
            </div>
<div class="hidden md:flex items-center gap-10 font-body-md text-body-md">
<a class="text-primary font-bold border-b-2 border-primary pb-1" href="#">Home</a>
<a class="text-on-surface-variant hover:text-primary transition-colors duration-300" href="#">Experience Now</a>
<a class="text-on-surface-variant hover:text-primary transition-colors duration-300" href="#">My Records</a>
<a class="text-on-surface-variant hover:text-primary transition-colors duration-300" href="#">Plans</a>
</div>
<div class="flex items-center gap-4">
<button class="px-6 py-2.5 rounded-full border border-outline text-primary font-medium hover:bg-surface-container transition-all duration-300">
                    Login
                </button>
</div>
</div>
</nav>
<!-- Hero Section -->
<header class="relative overflow-hidden hero-gradient pt-16 pb-section-gap px-margin-mobile md:px-margin-desktop">
<div class="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
<div class="text-center lg:text-left space-y-8 z-10">
<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/10 text-primary-container border border-primary-container/20">
<span class="font-label-sm text-label-sm uppercase tracking-[0.2em] font-bold">心靈綠洲 SOUL OASIS</span>
</div>
<h1 class="font-display-lg text-display-lg md:text-[56px] text-on-surface leading-tight">
                    當心裡很亂，<br/>先讓我們陪你整理。
                </h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto lg:mx-0 leading-relaxed text-lg opacity-90">
                    溫柔、穩定、可依靠的數位心靈空間。透過 AI 陪伴，幫你梳理情緒，找回內心的平靜。
                </p>
<div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
<button class="px-10 py-4 bg-primary text-on-primary rounded-full font-medium text-lg hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-1 transition-all duration-300">
                        開始 AI 陪伴
                    </button>
<button class="px-10 py-4 border-2 border-outline-variant text-primary rounded-full font-medium text-lg hover:bg-surface-container transition-all duration-300">
                        查看方案
                    </button>
</div>
</div>
<div class="relative flex justify-center lg:justify-end">
<div class="relative w-full max-w-[500px] aspect-square">
<!-- Product Mockup/Insight Cards Visual -->
<div class="absolute inset-0 flex flex-col gap-6 p-8">
<div class="bg-white rounded-3xl p-6 soft-shadow w-4/5 self-start floating" style="animation-delay: 0.5s;">
<div class="flex items-start gap-4">
<div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
<span class="material-symbols-outlined text-white text-xl">psychology</span>
</div>
<div class="flex-1">
<p class="text-sm text-on-surface-variant font-medium mb-1">AI 陪伴者</p>
<p class="text-on-surface leading-relaxed">我感覺到你現在的心情有些沉重，想跟我聊聊剛才發生的事嗎？</p>
</div>
</div>
</div>
<div class="bg-primary text-on-primary rounded-3xl p-6 soft-shadow w-3/4 self-end floating">
<p class="leading-relaxed">今天在辦公室遇到一點挫折，覺得壓力很大，不知道該怎麼辦...</p>
</div>
<div class="bg-white rounded-3xl p-6 soft-shadow w-4/5 self-start floating" style="animation-delay: 1.5s;">
<div class="flex flex-col gap-3">
<div class="flex justify-between items-center">
<span class="text-sm font-bold text-primary">情緒能量分析</span>
<span class="text-xs text-on-surface-variant">當前狀態：需要平復</span>
</div>
<div class="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-primary-container" style="width: 65%;"></div>
</div>
<div class="flex gap-2">
<span class="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] rounded-full">高壓力</span>
<span class="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] rounded-full">渴望被聽見</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</header>
<!-- Context Entry Cards -->
<section class="py-section-gap px-margin-mobile md:px-margin-desktop bg-white">
<div class="max-w-[1200px] mx-auto">
<div class="text-center mb-16 space-y-4">
<h2 class="font-headline-lg text-headline-lg text-on-surface">今天，想聊聊什麼？</h2>
<p class="text-on-surface-variant">選擇一個最貼近你當下狀態的入口</p>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
<div class="group cursor-pointer p-8 rounded-[32px] bg-secondary-container/30 hover:bg-secondary-container transition-all duration-500 hover:-translate-y-2">
<div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-primary text-3xl">favorite</span>
</div>
<h3 class="text-xl font-bold text-on-surface mb-2">感情困擾</h3>
<p class="text-on-surface-variant text-sm leading-relaxed">梳理關係中的糾結，找回愛人與愛己的平衡。</p>
</div>
<div class="group cursor-pointer p-8 rounded-[32px] bg-tertiary-container/20 hover:bg-tertiary-container transition-all duration-500 hover:-translate-y-2">
<div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-tertiary text-3xl">bolt</span>
</div>
<h3 class="text-xl font-bold text-on-surface mb-2">壓力焦慮</h3>
<p class="text-on-surface-variant text-sm leading-relaxed">在高壓生活中呼吸，釋放焦躁不安的情緒。</p>
</div>
<div class="group cursor-pointer p-8 rounded-[32px] bg-primary-container/10 hover:bg-primary-container/30 transition-all duration-500 hover:-translate-y-2">
<div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-on-primary-fixed-variant text-3xl">explore</span>
</div>
<h3 class="text-xl font-bold text-on-surface mb-2">人生迷惘</h3>
<p class="text-on-surface-variant text-sm leading-relaxed">尋找未來的方向，陪你探索生命中的各種可能。</p>
</div>
<div class="group cursor-pointer p-8 rounded-[32px] bg-surface-container-highest hover:bg-surface-dim transition-all duration-500 hover:-translate-y-2">
<div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-secondary text-3xl">bedtime</span>
</div>
<h3 class="text-xl font-bold text-on-surface mb-2">睡前陪伴</h3>
<p class="text-on-surface-variant text-sm leading-relaxed">在靜謐的夜晚，沈澱一整天的喧囂與疲憊。</p>
</div>
</div>
</div>
</section>
<!-- 3-Step Process -->
<section class="py-section-gap px-margin-mobile md:px-margin-desktop bg-background overflow-hidden relative">
<div class="max-w-[1200px] mx-auto relative z-10">
<div class="text-center mb-20">
<h2 class="font-headline-lg text-headline-lg text-on-surface mb-4">開始你的心靈整理之旅</h2>
<div class="w-20 h-1.5 bg-primary-container mx-auto rounded-full opacity-30"></div>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
<!-- Connecting Line Desktop -->
<div class="hidden md:block absolute top-24 left-0 w-full h-px border-t-2 border-dashed border-outline-variant z-0"></div>
<div class="relative text-center group">
<div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 soft-shadow relative z-10 border-4 border-background group-hover:bg-primary-container transition-colors duration-500">
<span class="text-3xl font-bold text-primary group-hover:text-white transition-colors">1</span>
</div>
<h3 class="text-xl font-bold text-on-surface mb-4">選擇當下狀態</h3>
<p class="text-on-surface-variant leading-relaxed">從多種心靈氣候中，點選最符合你此時此刻感受的主題。</p>
</div>
<div class="relative text-center group">
<div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 soft-shadow relative z-10 border-4 border-background group-hover:bg-primary-container transition-colors duration-500">
<span class="text-3xl font-bold text-primary group-hover:text-white transition-colors">2</span>
</div>
<h3 class="text-xl font-bold text-on-surface mb-4">描述內心困擾</h3>
<p class="text-on-surface-variant leading-relaxed">像對著老朋友說話一樣，自由地寫下或說出你目前的想法。</p>
</div>
<div class="relative text-center group">
<div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 soft-shadow relative z-10 border-4 border-background group-hover:bg-primary-container transition-colors duration-500">
<span class="text-3xl font-bold text-primary group-hover:text-white transition-colors">3</span>
</div>
<h3 class="text-xl font-bold text-on-surface mb-4">獲得陪伴與引導</h3>
<p class="text-on-surface-variant leading-relaxed">AI 將為你進行情緒分析，並提供暖心的回應與專業的心理引導。</p>
</div>
</div>
</div>
</section>
<!-- Feature Highlights -->
<section class="py-section-gap px-margin-mobile md:px-margin-desktop bg-white">
<div class="max-w-[1200px] mx-auto">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
<!-- Main Feature Card -->
<div class="lg:col-span-8 group relative overflow-hidden rounded-[40px] bg-primary text-on-primary p-12 flex flex-col justify-center min-h-[400px]">
<div class="relative z-10 space-y-6 max-w-lg">
<span class="px-4 py-1.5 bg-on-primary/20 rounded-full font-label-sm text-label-sm uppercase">核心特色</span>
<h2 class="text-4xl font-bold leading-tight">AI 陪伴回應：<br/>聽懂你沒說出口的委屈</h2>
<p class="text-on-primary/80 text-lg leading-relaxed">
                            我們的情緒模型不僅分析文字表面，更能感知背後的心理需求，提供溫柔而不說教的回應，讓你感受到真實的接納。
                        </p>
<div class="flex items-center gap-4 pt-4">
<button class="bg-on-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary-fixed-dim transition-colors">
                                立即體驗
                            </button>
</div>
</div>
<!-- Decorative Element -->
<div class="absolute right-0 top-0 w-1/2 h-full opacity-10 flex items-center justify-center">
<span class="material-symbols-outlined text-[300px]" style="font-variation-settings: 'FILL' 1;">forum</span>
</div>
</div>
<!-- Secondary Features -->
<div class="lg:col-span-4 flex flex-col gap-gutter">
<div class="flex-1 bg-surface-container-low rounded-[40px] p-8 group hover:bg-primary-container/20 transition-all">
<div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 soft-shadow">
<span class="material-symbols-outlined text-primary">calendar_month</span>
</div>
<h3 class="text-xl font-bold text-on-surface mb-3">情緒紀錄保存</h3>
<p class="text-on-surface-variant text-sm leading-relaxed">追蹤你的情緒脈絡，看見自己一步步變好的軌跡。</p>
</div>
<div class="flex-1 bg-surface-container-low rounded-[40px] p-8 group hover:bg-primary-container/20 transition-all">
<div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 soft-shadow">
<span class="material-symbols-outlined text-primary">auto_awesome</span>
</div>
<h3 class="text-xl font-bold text-on-surface mb-3">每日療癒引導</h3>
<p class="text-on-surface-variant text-sm leading-relaxed">每天一個小練習，帶你練習正念、呼吸與感恩。</p>
</div>
</div>
</div>
</div>
</section>
<!-- Subscription Plans Preview -->
<section class="py-section-gap px-margin-mobile md:px-margin-desktop bg-background">
<div class="max-w-[1200px] mx-auto">
<div class="text-center mb-16">
<h2 class="font-headline-lg text-headline-lg text-on-surface mb-4">找到適合你的陪伴方式</h2>
<p class="text-on-surface-variant">投資你的內心健康，從每天一點點的梳理開始</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-[900px] mx-auto items-stretch">
<!-- Free Plan -->
<div class="bg-white rounded-[32px] p-10 flex flex-col border border-outline-variant/30 soft-shadow">
<div class="mb-8">
<h3 class="text-2xl font-bold text-on-surface mb-2">基礎版 Free</h3>
<p class="text-on-surface-variant text-sm">適合初次嘗試，需要簡單傾訴的你</p>
</div>
<div class="text-4xl font-extrabold text-on-surface mb-8">NT$ 0 <span class="text-lg font-normal text-on-surface-variant">/ 每月</span></div>
<ul class="space-y-4 mb-10 flex-1">
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary text-xl">check_circle</span>
<span class="text-on-surface-variant">每日 5 次 AI 對話</span>
</li>
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary text-xl">check_circle</span>
<span class="text-on-surface-variant">基本情緒紀錄分析</span>
</li>
<li class="flex items-center gap-3 opacity-40">
<span class="material-symbols-outlined text-outline-variant text-xl">block</span>
<span class="text-on-surface-variant line-through">無限次對話陪伴</span>
</li>
</ul>
<button class="w-full py-4 rounded-full border border-outline text-primary font-bold hover:bg-surface-container transition-all">
                        免費開始
                    </button>
</div>
<!-- Plus Plan -->
<div class="bg-primary text-on-primary rounded-[32px] p-10 flex flex-col relative overflow-hidden soft-shadow scale-105">
<div class="absolute top-0 right-0 px-6 py-2 bg-primary-container text-on-primary-container font-bold text-xs rounded-bl-2xl">
                        推薦方案
                    </div>
<div class="mb-8">
<h3 class="text-2xl font-bold mb-2">專業版 Plus</h3>
<p class="text-on-primary/70 text-sm">適合想要深度整理、完整呵護心靈的你</p>
</div>
<div class="text-4xl font-extrabold mb-8">NT$ 199 <span class="text-lg font-normal text-on-primary/70">/ 每月</span></div>
<ul class="space-y-4 mb-10 flex-1">
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-primary-container text-xl" style="font-variation-settings: 'FILL' 1;">stars</span>
<span>無限次 AI 深度對話</span>
</li>
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-primary-container text-xl" style="font-variation-settings: 'FILL' 1;">stars</span>
<span>長期情緒趨勢深度報告</span>
</li>
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-primary-container text-xl" style="font-variation-settings: 'FILL' 1;">stars</span>
<span>專屬語音療癒冥想庫</span>
</li>
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-primary-container text-xl" style="font-variation-settings: 'FILL' 1;">stars</span>
<span>優先使用新推出的 AI 模組</span>
</li>
</ul>
<button class="w-full py-4 rounded-full bg-on-primary text-primary font-bold hover:shadow-lg transition-all">
                        升級 Plus 方案
                    </button>
</div>
</div>
</div>
</section>
<!-- Trust & Safety -->
<section class="py-section-gap px-margin-mobile md:px-margin-desktop bg-white">
<div class="max-w-[900px] mx-auto bg-surface-container rounded-[40px] p-10 md:p-16 text-center">
<div class="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-8">
<span class="material-symbols-outlined text-white text-3xl">shield_person</span>
</div>
<h2 class="font-headline-lg text-headline-lg text-on-surface mb-6">您的安心是我們的首要任務</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-10">
<div class="flex items-start gap-4">
<span class="material-symbols-outlined text-primary mt-1">no_accounts</span>
<div>
<h4 class="font-bold text-on-surface mb-1">隱私至上</h4>
<p class="text-sm text-on-surface-variant">所有對話內容經過加密處理，我們絕不向第三方透露或販售您的個人心情資料。</p>
</div>
</div>
<div class="flex items-start gap-4">
<span class="material-symbols-outlined text-primary mt-1">medical_services</span>
<div>
<h4 class="font-bold text-on-surface mb-1">非醫療聲明</h4>
<p class="text-sm text-on-surface-variant">本服務非專業心理醫療諮商。如有嚴重的心理疾病或自傷傾向，請務必尋求醫療機構協助。</p>
</div>
</div>
</div>
<a class="inline-flex items-center gap-2 text-primary font-bold hover:underline" href="#">
<span class="material-symbols-outlined">call</span>
                尋求緊急危機支持
            </a>
</div>
</section>
<!-- FAQ Section -->
<section class="py-section-gap px-margin-mobile md:px-margin-desktop bg-background">
<div class="max-w-[800px] mx-auto">
<h2 class="font-headline-lg text-headline-lg text-on-surface text-center mb-16">常見問題</h2>
<div class="space-y-4">
<div class="bg-white rounded-2xl overflow-hidden soft-shadow transition-all duration-300">
<button class="w-full px-8 py-6 text-left flex justify-between items-center group" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.arrow').classList.toggle('rotate-180')">
<span class="font-bold text-on-surface">這是一項心理諮商服務嗎？</span>
<span class="material-symbols-outlined arrow transition-transform duration-300 text-outline">expand_more</span>
</button>
<div class="px-8 pb-6 hidden text-on-surface-variant leading-relaxed">
                        不是的。Soul Oasis 是一項基於 AI 技術的心靈陪伴與情緒紀錄工具，旨在提供日常的溫暖支持與自我整理空間，而非替代專業心理醫師或諮商師的醫療行為。
                    </div>
</div>
<div class="bg-white rounded-2xl overflow-hidden soft-shadow transition-all duration-300">
<button class="w-full px-8 py-6 text-left flex justify-between items-center group" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.arrow').classList.toggle('rotate-180')">
<span class="font-bold text-on-surface">我需要註冊帳號才能使用嗎？</span>
<span class="material-symbols-outlined arrow transition-transform duration-300 text-outline">expand_more</span>
</button>
<div class="px-8 pb-6 hidden text-on-surface-variant leading-relaxed">
                        您可以先以訪客身份體驗部分功能。但為了保存您的情緒歷程紀錄與提供更個人化的回應，建議您註冊帳號。
                    </div>
</div>
<div class="bg-white rounded-2xl overflow-hidden soft-shadow transition-all duration-300">
<button class="w-full px-8 py-6 text-left flex justify-between items-center group" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.arrow').classList.toggle('rotate-180')">
<span class="font-bold text-on-surface">我的對話內容是安全的嗎？</span>
<span class="material-symbols-outlined arrow transition-transform duration-300 text-outline">expand_more</span>
</button>
<div class="px-8 pb-6 hidden text-on-surface-variant leading-relaxed">
                        絕對安全。我們採用銀行級的數據加密技術（End-to-End Encryption），您的對話內容僅供您與 AI 互動，不會有任何人類工作人員查看。
                    </div>
</div>
<div class="bg-white rounded-2xl overflow-hidden soft-shadow transition-all duration-300">
<button class="w-full px-8 py-6 text-left flex justify-between items-center group" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.arrow').classList.toggle('rotate-180')">
<span class="font-bold text-on-surface">Free 版與 Plus 版的主要區別？</span>
<span class="material-symbols-outlined arrow transition-transform duration-300 text-outline">expand_more</span>
</button>
<div class="px-8 pb-6 hidden text-on-surface-variant leading-relaxed">
                        Free 版適合輕量使用，每日對話次數有限；Plus 版提供無限次的深度對話、進階的情緒分析報告、專業的冥想引導音檔等全方位心靈支持。
                    </div>
</div>
</div>
</div>
</section>
<!-- Footer -->
<footer class="w-full bg-surface-container rounded-t-[40px] mt-24">
<div class="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-16">
<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-12">
<div>
<div class="font-headline-lg text-headline-lg text-primary font-bold mb-4">Soul Oasis</div>
<p class="text-on-surface-variant max-w-xs text-sm">
                        為現代人的忙碌靈魂，保留一處可以呼吸、可以示弱、可以重新出發的綠洲。
                    </p>
</div>
<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
<div class="flex flex-col gap-4">
<span class="font-bold text-on-surface text-sm">探索</span>
<a class="text-secondary hover:text-primary transition-colors text-sm" href="#">Home</a>
<a class="text-secondary hover:text-primary transition-colors text-sm" href="#">Experience</a>
</div>
<div class="flex flex-col gap-4">
<span class="font-bold text-on-surface text-sm">法律</span>
<a class="text-secondary hover:text-primary transition-colors text-sm" href="#">Disclaimer</a>
<a class="text-secondary hover:text-primary transition-colors text-sm" href="#">Privacy Policy</a>
</div>
<div class="flex flex-col gap-4">
<span class="font-bold text-on-surface text-sm">關於</span>
<a class="text-secondary hover:text-primary transition-colors text-sm" href="#">About Us</a>
<a class="text-secondary hover:text-primary transition-colors text-sm" href="#">Contact Us</a>
</div>
<div class="flex flex-col gap-4">
<span class="font-bold text-on-surface text-sm">追蹤我們</span>
<div class="flex gap-4">
<a class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#">
<span class="material-symbols-outlined text-sm">share</span>
</a>
</div>
</div>
</div>
</div>
<div class="pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
<p class="font-label-sm text-label-sm text-secondary opacity-80">© 2024 Soul Oasis. All rights reserved.</p>
<div class="flex gap-6">
<span class="text-xs text-secondary opacity-60">繁體中文 (Taiwan)</span>
</div>
</div>
</div>
</footer>
<!-- Simple Interactivity -->
<script>
        // Subtle entrance animations
        document.addEventListener('DOMContentLoaded', () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-8');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('section > div > div').forEach(el => {
                el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8');
                observer.observe(el);
            });
        });
    </script>
</body></html>