---
title: 警惕Vision Centric
date: 2026-06-11 22:41:00
tags:
  - Vision
  - Multimodal
  - Self-Supervised Learning
  - Robotics
categories:
  - Research
---

## TLDR

Vision Pretraining是必经之路，但Vision Centric不再足以解决下一阶段的视觉问题，Omni Model才是未来

## 免责声明

本文由Codex私自撰写，博主本人仍在看广告复活，因此本文仅限参考，非严肃定论。文中许多观点蒸馏于社区讨论、前辈交流和同龄人的启发，若有应补充引用、署名或表述不准确之处，欢迎指出。

<!-- more -->

## 前言

> Vision Centric不是“重视视觉”，而是“认为视觉可以以自身为中心，通过视觉代理任务和视觉表征scaling独立逼近通用智能”。

熟悉我的朋友都知道，在半年前，我还是拥护3DV Scaling的，或者说非常Vision Centric的，甚至不太喜欢LLM。可是机缘巧合之下，我误入了某个LLM社区，同时也认识了许多Unified Model背景的朋友，最重要的是听到了非常多来自业界的反馈。

我逐渐意识到，可能确实自己很多观点错了，有些问题它并不是真问题；不是 Vision不重要，恰恰相反，Vision Pretraining可能比很多人想象得还重要。问题在于，很多 Vision 侧长期执着的问题，未必真的需要被一个纯 Vision Centric 的范式完整解决；即使是vision scaling up，它也仅仅能解决一部分问题，甚至很难兼容一些更promising的方案；而Language以及Agentic Workflow Planning这些看上去非常不符合Vision Taste，带有inductive bias的范式，反而有一些Vision非常需要的属性，也并没有那么不兼容。

现在是2026年，Unified Model/Omni大力发展，Agentic与LLM逐渐展现出新的能力边界，但是Vision Centric的范式却陷入了某种困境。我现在越来越觉得，Vision Centric最大的问题不是它做不出东西，而是它太容易把问题空间封闭起来。

可能我们确实应该思考下，Vision Centric真的对了吗？如果说Language对 Vision 而言，是拐杖也是毒药，那么Vision对Language乃至其他Modality而言，难道不也可能是一把双刃剑吗？

Vision当然重要，所有人都知道Vision将会在未来是主角之一，但我们可能需要警惕一种过于纯化的Vision Centric，在通往智能的道路上，未必是谁占据中心，而是谁能在一个更庞大的系统里成为不可替代的能力，为整个智能系统服务。

Vision本身，如果目标是通用智能，脱离了服务于Robo和Agent，并不能单独存在。

## 3DV Scaling的赌注对了吗？

所以如果要讨论Vision Centric，我想先从自己曾经最相信的3DV Scaling说起。因为它几乎是Vision Centric的一个浓缩版本，部分直觉并不愚蠢，甚至很多都有所启发。问题在于，它们是否足以推出一个更强的结论：Vision可以以自身为中心，仅靠reconstruction/generation这类视觉代理任务，一路 scaling 到通用智能所需要的理解能力？这就是我现在最怀疑的地方。

3R的“重建/生成世界就可以理解世界”吗？

我记得当时入行的时候，3R带动了非常多follow up，在把一些过去很handcrafted的东西变成网络之后，3DV如火如荼。而有了网络E2E的做法后，就肯定要考虑这么一件事情：我们能不能用3D reconstruction作为代理任务，来scaling up训练出一个更加fancy的backbone，为vision与robo任务提供某些更完备的表征呢？

这一想法在当时看来好像是make sense的，我摘取一些观点给大家参考。（1）世界是一个立体的、动态的世界，也就是所谓的3D/4D，那么我们用3D/4D数据scaling训练模型不是很合理吗？（2）目前的各种Vision Model，它们都是在2D data，比如image上进行训练的，他们可能没有几何token。（3）时空是连续的，视觉也是连续的，vqa这些离散的做法可能不适合vision。（4）人是双目视觉，可以推断深度，并且现在的vision model，他们无法清晰认知到世界的三维结构，我们需要立体视觉（5）根据认知心理学，人需要能重建世界、想象世界，才能理解世界。

好的，那让我们逐一讨论，看看这些论述成不成立。

### （1）训练数据需要3D/4D scaling么？

> 我们暂且认为，training是为了获取data中的knowledge，具体论述请到“自监督”章节进行阅读，或者可以先提前阅读RayZer作者Hanwen Jiang老师的Blog：《Knowledge is the new representation.》[1]

在训练数据这一块，又要回到经典的“显式3D与隐式3D”之争，目前而言，如果作为一个为下游Robo task服务而训练的网络，其实你用什么显式还是隐式data可能都无所谓，data bias可能在不涉及language/action的single modality里面，也不是那么重要，重要的是数据数量与质量。

#### 点云数据

如果是点云数据，实际上可用的数据并不多，至少相比于image/video而言，差了几个量级。

现有的各种dataset，绝大多数都是接近static的，你如果使用这些data进行训练，那你大概率只能得到一些所谓的“静态表征”。并且，这些static数据里面，又有相当一部分是合成数据集，合成数据集是经典被诟病的“分布和现实mismatch，会影响泛化”，但至少还算可用；最要命的是一些scan net之类的dataset，这些数据集由于采集设备问题非常脏，如果你要train model，第一步就是要洗数据。dynamic pointcloud数据接近没有，而且也和static数据遇到了相似的问题，并且dynamic data只会更脏，“动态表征”不是一步学出来的。

#### 视频/多视角数据

那既然点云数据看起来不太可靠，那我们可不可以使用Video这种2D+1D的data，或者使用一些退而求其次的Multi-view data呢？

如果我们使用的还是LVSM这种更加supervised learning的model，video和multi-view data的paired camera pose 哪里来？实际上web可靠能用的data也并不多，真实数据在过滤清洗过后就没更加多少了，有些video和multi-view其实是非static的，训练model还是得curriculum learning，先得有足够多干净的static data你才能进一步训练dynamic的，否则模型很可能会崩。那么又回到了去合成数据的路子了。

> 如果使用的是RayZer这种unsupervised model，确实看起来很有潜力，但是与其他领域的unsupervised model遇到的问题一样，目前而言，ssl并没有一个真正工业级scale的backbone，具体细节可以到“自监督”这一块阅读

那么你可能又想了，OK，如果我们不想要LVSM这种supervised model，是不是可以尽可能不要camera pose，也能支持video呢，比如说像video gen model那样？那最大的悖论就来了，为什么你不直接用video gen来训练呢，为什么还要用3R的backbone进行训练？

我们已经见到了很多用video gen model来为3R model生成NVS data的工作了，那既然你video gen都可以做NVS做的很好了，并且video gen做的好的前提是它在训练的时候，已经有很多好的video/multi-view data被造出来了，那为什么我们不直接全力投入video gen，给video gen造数据data，非要多此一举给3R再造一次数据呢？

在服务于下游这个角度，3R能做的，大部分任务video gen也能做，video gen也可以做backbone，甚至做的更好，video gen本身还可以生成更加promising的短剧小视频，那3R本身就遇到存在主义危机了。

### （2）2D Model没有几何token吗？

> 几何token指代某种结构性的Geometry Knowledge/Representation

这个观点我其实一直不是很理解，你如果说2D model（不包括video model）可能没有一些cross-view、spatial-temporal的representation，我可以理解；但如果要说只是一些static、结构性的representation，我其实不太同意。

我之前讨论的时候，有人展示了一些点云图/深度图，问我：这些是几何token，2D model能做到吗？但有个问题是，如果你能做深度图，那么你大概率也可以做点云图（camera pose其实也能用别的手段计算处理），但是深度图它并不是一个很本质的东西，或者说它说明不了什么。depth本身还是由人定义的，它并不是一个很nature的东西，我们人类也不需要得知精确数值，只要知道大概的前后顺序就行，也是一种空间感知。

但是问题在于，前后顺序这东西，不是segmentation强相关的吗？在ViT以及DINO这些2D model里面，他们不需要进行专门训练也可以涌现出某种分割能力，那么这些算不算几何token呢？

3R本身也是一个在3D space里面的MAE模型，如果我们把DINO这种model用3D unsupervised model的角度来看，我们进入模型时，先进行数据增强，也就是把一张图变成两张有重叠部分的multi-view，再进行某种归纳学习，那么2D model不就是一个camera只能平行于照片表面移动的3D model吗？并且DINO v3这些新model里面，也加入了不少multi-view/video data进行训练，2D model为什么会没有所谓的几何token呢？并且即使是VGGT这种sota 3R model，它使用的也是DINO as encoder，3D任务可能其实用2D model解决的就七七八八了啊。

### （3）视觉与时空是连续的，不能用VQA这种离散的方法来做？

其实这个观点更适合放到Unified Model/MLLM里面进行讨论，因此我可能仅简单阐述下观点。

目前而言，VQA loss还是一个比较有效的监督信号，他可能稀疏，可能相比于pixel loss而言，做不了很fancy的reconstruction。但是如果说3R model是为了下游而服务，比如说做spatial reasoning，那么非常遗憾的是，无论使用任何3R model进行alignment/condition，最后效果，至少在VSI分数上，可能都比不上rae/vae as encoder，并且使用spatial reasoning相关的vqa进行post-train的范式。

3R alignment/condition能超越的情况，也仅仅是没有进行完善post train，3R alignment/condition可能只能作为一个初始化，实际上post train到后面大家都差不多。并且alignment/condition还会修改模型接口，丧失了某些简洁性/通用性/可拓展性，会约束模型的上限。目前这一类工作基本只测试了spatial相关，没有测试通用mllm benchmark，通用的可能会掉点比较严重，字节的VST[2]就有相对更完善实验，推荐一看。

当然，除了VSI分数之外，还有没有其他的有趣现象可以体现3R as condition/alignment的优势，我目前并没有观察到。

至于离散和连续，Vision领域做了这么多年，可能也都慢慢意识到这更多是个工程问题吧，和优化关系更大，离散还是连续实际上效果都大差不差，与Vision这一modality关系不大，还是苦一苦infra吧。

### （4）人是双目视觉，立体视觉才能理解三维世界吗？

这一点其实非常有趣，我还专门去查询了一下生物相关的内容，不过我得到的结论是，双目视觉可能更多是为了扩大FOV，它当然提供深度线索，但空间感知还依赖运动、遮挡、尺度先验和行动经验。并且有些时候双目视觉并不一定是好事，松鼠的两只眼球分的太开，他们的视觉可能就有些诡异，因此行动起来一卡一卡的。

而且就按照常识而言，人类没一只眼睛也能正常行动，视野盲区大了而已。因此空间感可能并不是双目视觉带来的，而是在空间中移动学习的某种属性，深度估计这些可能更像是后验知识，并不需要精准的仪器测量。就算你更换了某些硬件，比如近视，从模型来看，基模训好后总要做finetune的吧，到最后也大致可以适应不同的相机参数的，我们需要更多learning based的view。

好玩的事，我们可以听说robotics领域有很多使用双目摄像机/多摄像头的，其实从视觉感知这种病态问题约束来看，这确实是好事情，但问题是，你在桌面机械臂，装一个top camera，和手腕上又装一个camera，或者是给humanoid背后装一个camera，这在data collection这一角度看是灾难性的，因为没多少人和你的设备方案一样，这种多目视觉只会不scalable。

更多相机确实能缓解感知病态性，但它未必能带来可 scale 的数据范式，并且这种方式真的不是在做传统机器视觉嘛？

### （5）人类需要重建/想象世界才能理解世界吗？

这一章节我其实想放到“世界模型”这一章节进行论述，因此在这里仅简单总结下。首先，作为一个给下游使用的初始化模型，reconstruction/generation确实可以作为代理任务，但是并不是重建更好，下游就更好。代理任务和下游任务的相关性并不是1，gap还是非常大的。

即使正相关，视觉指标也反映不了什么，这一点我们会放到“vision benchmark”进行更详细论述，不过一般而言，NVS的话，object超过30，scene超过20基本就饱和了，普通的image gen model在psnr上做到17，专有模型做到30，其实视觉效果也差不多。超过这些阈值，对着刷eval就不礼貌了，你还不如用clip score，可能都比psnr这些管用。

并且代理任务作为服务于下游，有很多选择啊，VQA其实也行，NVS这种task可能更多还是作为proxy好一点，pixel现在还是有很多问题。

> 具体可以看看Tianyuan Zhang&Sonta的Test Time Training Done Right[3]。

而且退一万步来讲，我们不看指标，就单从认知心理学角度，我们平时真的要想象世界吗？那我说，现在让你重建世界，你能重建吗？我相信不太行吧，可能这更多还是个为文章增加哲学色彩的叙事。

### 3DV的未来在哪里？

目前来看，3DV的scaling在工业化，作为下游任务的backbone角度来看，可能并不是最make sense的选择，尤其是我们还有Video Gen这条路线，那么3DV就真的是一无是处了吗？那肯定不是，3DV能存在这么多年，从graphics时代到scaling时代，始终有一席之地，绝对是有他的不可替代之处的。

其实我们还需要更加分开一些概念：如果是为了更加传统的机器人建图等场景，那么其实目前的一些online reconstruction也是有些瑕疵的，因为实际上online reconstruction from vision精度并没有想象中那么高，消耗的硬件资源可能也比较高，很多工程场景里，激光雷达仍然是更可靠的选择。已有的成熟方案，不用白不用，至少在过渡期里，可能未来我们需要探索一些更加工程完善的手段，来更好服务于机器人以及其他场景。

剩下的一些场景，可能主要还是游戏资产、仿真资产等领域，你说他们没用吗？不可能，实际还是有不少需求；但是你说这些领域非常有想象力吗？那更加见不得，目前的AI大跃进时代，并不是看谁更有用，或者谁更稳定，而是看谁更有叙事空间。这也是3DV目前的一个困境，希望未来能随着更多场景的诞生而再次辉煌。

## 自监督的定位在哪里？

> 自监督学习通常指不依赖人工标注，而是通过预设的代理任务，从数据自身构造监督信号的训练范式。

前面讨论 3DV Scaling时，我们暂且接受了一个说法：training 是为了从data中获取 knowledge。这个说法听起来很自然，也几乎是所有foundation model叙事的起点。但放到视觉里，一个马上会出现的问题是：什么叫从视觉数据里获取 knowledge？或者说，如何得到vision representation？我觉得这也是非常Vision Centric的一环。

在此之前，不得不品的一环便是language这种看起来反the bitter lesson的modality，与vision相对立，批评的观点也确实非常直觉：“language带有大量人类的inductive bias，不如vision那么natural，我们网络学习要尽可能去除bias“。那么在这种情况下，我们确实不应该去使用languag**e，而是尽可能pure vision。**

或者说，网络学习是要尽可能去denoise，然后形成某些归纳性的东西，它可以叫做表征（representation），可以叫做某种manifold，也可以说是某种很像聚类的存在。总而言之，大家肯定会想，打label这些多麻烦啊，我们不想提供外部信号，可不可以让model通过某些method，一些代理性任务，自己通过某种压缩/信息差/正则化（LLM侧比较喜欢正则化这个词汇，Vision侧则更喜欢信息差），学习数据内部的结构，来得到某种可以供下游任务使用的、尽可能task agnoistic的通用特征/表征/latent？越少bias就越符合the bitter lesson。

### （1）自监督仍然有bias

> 自监督，即Self-Supervised Learning，SSL

确实，这个愿望非常美好，但实际工程实现起来，我们会发现一些有趣的地方。

首先观察下Mask Predict的SSL Method，Vision侧以MAE为代表，我们认为它使用了mask来消除了大量冗余，迫使模型从剩余信息里归纳出核心的内容（表征），并且成功做work了。但是如果我们反观一下language这一侧，BERT是MAE祖宗，它也是用mask，只是相对于vision的高度冗余，language的mask ratial更小，而且BERT也work。那么两个看起来差不多，BERT是不是自监督？你可能会说不是，因为language有很多bias，vision很少——但是BERT就是正八字旗的自监督啊。

那你又说了，OK，比如说mask prediction这一类，和data无关，你是language还是vision都不重要，只是模型架构的范式，才叫做自监督，好的，让我们再来看一个可能有混淆定义嫌疑的鬼故事：GPT这种AR是不是自监督？

你可能会说，GPT肯定不是自监督。但是GPT从mask而言难道不也是一种BERT的特殊版本么？只是从random mask变成了causual mask，更别提现在还有dllm的story，AR is a kind of Diffusion，Diffusion也是一种mask！那兄弟，咋办，你要跟我玩弄架构分类定义，没招了，那我们结束架构范式的讨论。

让我们回到数据来看，我们之前很大的一个争议是，language带有很多human的inductive bias，而vision则至少是更natural——但是有多少inductive bias，对模型的学习到底是多重要？我们模型学习的，到底是denoise，还是learn from bias？又或者说，这二者是同时发生的？

其实这一论战可能在CLIP出现之后已经somehow结束了，CLIP和SigLip这一类尽管是semi-supervised model，但它告诉我们，即使是imagenet，它也有着大量implict label，甚至和language可以搭配的很好。即使回到vision本身，它也并不是完全没有bias，bias可能在你选取主体的时候便已经存在了，这是human bias。如果再走远一点，图像里面的边缘结构、光照条件、深度线索、物体轮廓，他们是不是某种更加自然界的bias？或者不称呼bias，我们换个名称，叫knowledge，那么model实际在学习的难道不就是这些knowledge？或者说，模型在学习bias，那么自然界的bias和人类的bias真的差别有那么大么？人类不是真实世界的一部分么，自然界难道不包含人类及其造物么？

那么，human bias感觉并没有那么不堪，即使是image也有大量的人造物类别，甚至更极端还有OCR、图表，他们差别真的会非常大么？而且如果真的按照knowledge进行分类，OCR、图表这一类，他们不是更加应该属于language么，为什么大家会认为它是vision呢？而且即使是language这种看起来全是bias的范式，LLM却可以非常好的scale，而Vision直到今天，都没有任何能与LLM规模抗衡的开源模型（Seed Dance和Image2之类闭源不算，但是规模最大可能在200B左右）。

所以，现在看来，vision和language在bias/knowledge不同的叙事，似乎并不成立，自监督还是有bias，与主流supervised范式的界限好像没那么明显。

### （2）自监督难scale up

其实我非常喜欢自监督，至少在各种网络设计上，如果抛开外界各种消息，我会觉得自监督，无论是MAE MoCo SimSiam DINO JEPA，都是无与伦比的巧妙与inspired。但是问题可能就出在这些inspired的巧妙设计上，我们发现mask predict、contrastive learning等各种method，可能还是遗留了太多手工设计，这些手工设计有可能影响到了自监督的scale up。

> 注意，自监督可以一定程度上scale up，Peter Tong的WebSSL证明了这一点[4]，但是能不能scale到更加大的规模，这是一件非常exciting的事情

其实在2021年以前，还有大量非常好玩的代理任务，尝试把自监督做work，包括但不限于：拼图、旋转、图像翻译、时间快慢判断….但是它们几乎都是各自为政，没有接近的网络backbone。即使是现在主流的DINO或者正在发展的JEPA系列，也还是有着不小差异。

自监督模型目前并不是那么好训练，在早期就已经遇到了很多如模型坍塌等问题，现在在一些工程手段解决后，也还有着一些超参问题比较令人头疼，而且这些trick往往会被认为是反bitter lesson的“正则化”。在训练后，网络利用率目前也并没有那么高，往往只摘取一个分支进行推理，这可能也是一个未来值得改进的方向。

如果一个路线需要大量 method-specific trick、teacher/student 结构、stop-grad、multi-crop、mask ratio、augmentation policy 和超参调节，才能稳定训练并迁移到下游，那么它当然可以很强，但它还不像 next-token prediction 那样，形成了一个足够简洁、统一、infra-friendly 的 scaling recipe。

总而言之，自监督模型可能需要一个更加收敛、更加简洁的路线，我们期待有团队能将这些问题定义并且解决。

### （3）自监督的定位重合

我其实觉得，上面的两点，其实都不是目前自监督遇到的最大难点，它们都是科学问题和工程问题，最大的问题反而可能是：自监督到底应该用在什么地方？自监督可以单独作为主要的backbone么？自监督目前在真正应用中到底是怎么样一个定位？

如果放眼最近3-4年的各种工作里，我们会发现，训练自监督模型本身的越来越少了，大家基本上都是把自监督模型直接拿来用，比如DINO v2就在目前几乎所有与vision沾边的领域，作为vision encoder/alignment被广泛使用。这看起来是一件好事，自监督模型在外面发光发热！

但是问题在于，除了encoder/alignment，作为一个服务于下游的初始化目前使用SSL model as backbone的big model似乎主要存在于学术界的toy experiment上做实验性探索。我不认为unscalable/未经过scale up的研究就不算真正的科研，但是如果你想要为下游任务服务，至少目前而言，同等规模下，SSL model和supervised model在表现上并没有什么很大的区别；甚至supervised model，因为其简洁性，更加容易进行后训练；并且最大的区别在于，我们可以使用更大规模的supervised model，拥有着明显的性能提升，目前自监督模型在2026年还是太小了。

也许自监督模型其中一个愿景是，我们不需要像supervised model那样，做成那么恐怖规模的大，模型可以在一个小的规模就能有很好的效果。但是目前的问题是，我们仍然没有找到自监督到达这个饱和sota性能的下限规模，目前而言反而是scaling law依然有效。如果我们都没有找到这个“最小规模是多少的”答案，而supervised model在以上百倍的规模于各个领域拓展能力边界，那至少在我看来，我们应该继续先scale up，也许哪一天我们能遇到预料之外的惊喜。而且有个悖论是，如果自监督想摆脱“堆参数容量记忆”“数据驱动的离线映射构造”的范式，但目前自监督的scale up一直看不到上限，那么自监督何尝不是勇者终成恶龙呢？

### （4）自监督的通用表征可以让别人来做吗？

而抛开backbone这一美好愿景不谈，自监督一直希望能为下游提供一个良好的表征，或者说作为初始化处理，我们单独看encoder/alignment这一功能。

As Encoder。DINO v2一直饱受“丢细节”的争议，在细节方面有着VAE这一竞品，重合领域还有着SigLip竞争，即使在RAE里面，SigLip目前也是比DINO v2要更好，那么DINO v2的地位不稳。这些其实只是encoder间的小打小闹，最大的存在主义危机在于，encoder这东西未来还需要吗？尤其是在MLLM这种地方。

可能业界观察到的更加明显，无论你使用什么encoder/alignment，在不涉及video的任务，仅限于image处理的话，MLLM/UMM训到后面，如果well trained，模型性能差别好像不是很明显；甚至大家开始怀疑，不是因为用什么encoder更好，而是在小规模时，backbone不是那么强，encoder确实可以提前先处理好一些特征，保住了下限；但是scale up上去之后，backbone本身已经足够强了，encoder反而会限制住模型的上限，而不是保下限。而且有句很经典的话，如果你把encoder/alignment模型换了，那不是还要再训？

目前而言有一个新的流派，叫做Encoder Free，或者Native Pixel，刚刚起步，还有争议（被“原生多模态”这概念带进去的）。其实动机可能就在于，包括自监督也这么认为，我们是否能有一个完美表征？如果有，那是不是更加说明我们要无损输入，让backbone这个更大更强的东西承担通向完美表征？如果你认同，那么我们确实应该把自监督as encoder/alignment直接丢了，让backbone来承担完美表征的任务。这可能不是自监督自己的问题，更多的论述放在后文。我仍然倾向于认为，长期看 Encoder Free / Native Pixel 会是更自然的方向。

> 强烈推荐Ziwei Liu组的Haiwen Diao的系列作品，包括但不限于：NEO[5] EVE[6] SenseNova-U1[7]

### 自监督路在何方？

其实很多人认为自监督这个领域太难做了，同时一些很支持很喜欢自监督的朋友也认为，自监督想要做work到scale up这件事情任重道远，他们并没有足够的资源和时间去做这件事，但是我依然相信自监督在未来可以大放异彩，只是现在缺少更多人、更多资源去做一些在LLM后时代的探索，期待有团队可以做好这件事情。



## 视觉能力指标可靠吗？（写的好乱）

我其实觉得，自从 LLM 侧的 next-token prediction 证明了一个简单、统一、可 scaling 的训练目标能够导向极强的通用能力之后，Vision Community 就一直在寻找一个能够对标 NTP 的 real task，或者说某种视觉侧的“终极任务”。但很显然，现在已经是 2026 年，我们仍然没有形成共识，也没有一个真正 unified 的视觉任务。

有人继续 vote for VQA，有人大力发展 reconstruction / NVS，有人坚守 segmentation / detection，很多人去做 generative task，折腾各种 FID / aesthetic score / preference model，还有人开始进军一系列 robotics task。这些任务看起来都有自己的合理性，也确实能代表一部分视觉能力，但没有任何一个任务能够彻底吞下整个视觉问题，总有一类下游能力无法被它覆盖。

所以我们需要考虑一件事：所谓视觉的“终极任务”或者“统一任务”，真的存在吗？当然，你可以说 everything is generation，但如果 generation 只是一个过于宽泛的口号，它就和“everything is prediction”一样，无法自动告诉我们应该预测什么、用什么 loss、如何评估、以及这个指标和真实下游能力之间有什么关系。

即使是LLM 侧也并非所有能力都有统一评测，尤其是 agentic workflow 仍然很难测，至今没有什么很unified的评测手段；但至少 NTP 作为训练目标和基础能力之间建立了相对清晰的 scaling 关系。Vision 侧的问题在于，我们确实可能找不到“终极任务”，那找个类似NTP的主要代理认为行不行，但我们连“用哪个任务作为主要代理”都还没有形成类似共识。

如果视觉不存在这样的“主要代理任务”，那么自然也就很难存在一个“统一指标/主要指标”来完整衡量视觉模型的能力。于是指标就会从“衡量能力”的工具，变成反过来规定“什么才算视觉能力”的框架。

但问题在于，这些框架真的可靠吗？有时候，我们真的不是在hack这些框架吗？

### （1）低层指标不真实（写的好乱）

这种反过来规定能力的现象，在低层视觉指标里其实非常明显。因为低层任务看起来最客观：有 ground truth，有 pixel loss，有 PSNR / SSIM / LPIPS，还有FID，有一个可以排序的数字。但问题也恰恰在这里：越是看起来客观的指标，越容易让我们忘记它到底在衡量什么。

####  Perception&Distortion

这里需要区分两个概念：distortion 和 perception。distortion 关心的是输出和某个具体 reference image 的距离，比如 MSE / PSNR / SSIM；perception 关心的是输出是否像真实数据分布里的自然样本。前者是 sample-wise fidelity，后者是 distribution-level realism。

首先来观察下PSNR这类distortion loss，我之前是做3D出身的，当时大家在3DGS的training上发现一个很诡异的现象，你如果用了些方法去掉了artifacts，视觉效果变好了，但是PSNR掉了不少，为了发文章，大家又改回去了。然后在NVS这种任务上，REALE10K和GSO的bench比较小，经常会有人用疑似电路图的魔改ViT网络把PSNR刷到40+以上，但是实际上肉眼效果比不过T2I model，PSNR约20左右。

在一些小任务、小场景里面，比如low level，GT完全见不到，基本都是人造合成/特殊collect的benchmark，不可能在一个地方完全控制变量，only weather difference，因为其他很多光元素也会变。然后大家又开始overfit这种场景的PSNR，结果做出来的东西还不如直接用不如看看CLIP/VLM as judge判断下有没有去雾成功。

很多low level任务上，甚至应该控制albedo分量的SSIM，去掉光照的影响，光照分布有自己的prior，而不是RGB spase的similarity。underlying会有一个分布的图对应给定的condition，你测一个鼓励regression的指标，那当然刻画分布只会越来越烂。

那么LPIPS这种perception loss呢？其实我是更支持使用perception loss的，但问题在于，perception loss这玩意和distortion loss一样，只要是固定公式计算的metric，都可以被刷爆。perception loss也只是更贴合人类感知，并不代表他就是人类感知，而且这些指标都已经很老了。

> 推荐阅读
> Rethinking Lossy Compression: The Rate-Distortion-Perception Tradeoff[8]
> What Makes for Good Views for Contrastive Learning?[9]

那你说能不能让perception和distortion指标都高呢，这样或许能避免对着其中一个去刷分？很遗憾，老一辈已经告诉我们了，rate-distortion曲线存在一个trade-off，低失真不等于高感知质量，在资源受限或任务本身多解时，二者甚至会互相牵制。

这也是为什么低层指标，如distortion会出现反直觉现象：一个模型可能 PSNR 更高，但图像更糊；另一个模型可能 PSNR 更低，但人眼觉得更自然。

但 perception 也不是最终答案。一个图像看起来真实，不代表它忠实于输入，也不代表模型理解了场景。进一步看 contrastive learning，好的 view 甚至应该主动降低 mutual information，只保留 task-relevant information。

#### FID

其实这也是一个非常老生常谈的问题了，尤其是做image gen的同学。目前基本上，没有任何主流业界会很看重FID之类的指标，基本上全是AA。即使是GPT Image2、Nanobanana2这种最好的闭源T2I Model，他们的FID还真可能不咋高。

我记得朋友经常吐槽，他不想看到每周都有数十篇文章又整了一些小改动，然后在Stable Diffusion上把FID刷到0.9，你问我为什么不刷FLUX？能刷FLUX的多少和业界有点关系，没卡也训不动。

我觉得FID这指标基本没法看了，大家早就能在imagenet上，把FID刷到比真实FID还要低；还有经典案例BLIP-3o，虽然BLIP-3o很早就指正了合成数据集的问题，但目前的情况就是，T2I都在对着BLIP-3o合成数据集疯狂刷分overfit，然后大家的人物都是油光满面的。可能现在大家早就对hack FID指标轻车熟路了。

现在大家感觉基本也没招了，要么就是做新的DINO-FID指标来推迟几个月被刷爆，要么就一起玩一玩黑色幽默，直接告诉你，既然你想hack刷分，那我们就明着来，把指标当作E2E训练loss得了，这样大家都无法超越我的baseline，杜绝了后续刷分泛滥，这是好事啊！

> 参考Representation Fréchet Loss for Visual Generation[10]

可能视觉模型真正需要的，既不是保留所有像素细节，也不是只追求视觉真实感。

### （2）高层指标也有Shorcut（写的好乱）

#### VQA

说到高层指标，那又是不得不品的Language环节。依赖于Language的代理任务曾经有Caption retrieve VQA，在2026年的当下，似乎只剩下VQA了，因为前面俩太简单了。目前有非常多paper，认为MLLM/VLM看不懂Image，或者不看图也可以回答VQA，说VQA有shorcut，来佐证模型能力不如人类婴儿。但实际上，这可能并不是一个本质的问题，或者说，他其实可能就是个数据问题，于数据分布不均衡有关系，目前似乎业界认为补上足够多的数据进行alignment，这事情就可以解决的差不多。或者说其实并没有哪个主流闭源模型非常专注于多模态，把视觉能力当作核心能力，视觉在目前的LLM体系里可能只是锦上添花，被当作another language训着玩。即使它不是一个数据问题，可能也得先加数据再训下模型，才能排除“数据问题”的可能性。

> 推荐阅读Shusheng Yang的Benchmark Designers Should" Train on the Test Set" to Expose Exploitable Non-Visual Shortcuts



#### representation probing



#### 3D Task Probing



### （3）真实世界指标目前几乎不可用

#### 3D reward是触觉缺失



#### Vision会覆盖Action



## 人类的视觉问题一定要以Vision Centric的方式解决吗？

其实在考虑Vision Centric Pretraining前，我们可能应该先定义好，究竟Vision侧想解决什么问题。如果我们不先定义好Vision的期望边界，或者说确定需求并且定义好问题，那么我们可能根本不知道模型应该往哪里去优化。

实际上我们可能应该先注意到一个事实：人类在面对某些问题时，使用的是人类视觉来解决，但是对于模型而言，可能视觉方案并不是这个问题的最优解。如果我们在这些问题下，还是强行使用视觉方案去解决，反而会损失效率和上限。

### （1）警惕某些惯性直觉（好乱）

#### GUI与CLI之争（写的）

现在是Agent时代，在猛猛蹬Codex之后（Claude Code那个多模态感觉约等于没有），我经常会观察到，怎么一涉及到多模态，比如博客截图做笔记，token用量就唰唰往上飙升，甚至远远超过一些有long context的coding。这怎么和我们人类不一样啊，我们读书要多久，但是看图一下子就知道怎么做呀。

还有个很神秘的事情是，涉及到图像的一些简单操作，比如“校准截图不要截断caption”，Agent经常会匪夷所思地大量思考，反复校准，我完全没看出来校准前后有什么区别，甚至有时候会直接给你调用image2自己重新做了一次。与此同时，一旦你尝试让Agent去使用GUI工具接管一些桌面操作，不仅又慢又贵，而且Agent操控的准确率低的可怕，几乎很难真正完成一个任务，比如“打开网页，点击空白座位”，最后还不如自己来。

与之形成鲜明对比的是，如果有任务可以从视觉为主任务变成code为主任务，那么Agent的效率和成功率都会大幅提高。

一个简单但可能不恰当的例子是，如果你需要制作一份CVPR海报，正常来说可能image2一键生成可以做到差不多能用的初稿，但是使用T2I生成的海报在后期修改简直是灾难性的，要么Agent会自己去琢磨怎么转SVG，要么直接在原图上进行贴图，总之最后不如自己用PPT手搓一份。但如果你最开始就选择用Latex/SVG/PPT进行海报制作，那么Agent反而可以做的又快又好，还更加适合精细操作，也更适合后期维护。

同时回到GUI问题上，Agent一页页进行截图或者视频抽帧，大概率会做的又慢又不好。但如果一个APP/Web提供了API，或者原来就有API，并且给Agent提供了更多的权限和流程优化，让Agent能直接使用CLI，那么Agent解决问题的速度会非常快。

如果非要总结的话，很常见的一类任务失败，大概率是模型对任务状态的判断不对，以为自己完成了，其实并没有，目前Agent通过视觉判断的能力还是欠缺。另外有些能力不太够的模型，非常容易迷路、陷入死循环。还有就是在长程任务上的表现，无论是子目标拆解、错误状态恢复，模型成功率大幅下降，目前而言还是需要更多code/language类的planning更加简单直观。此外就是上下文长度一长，尤其是Image一张图可能就几千Token，注意力被分散，模型就降智，记忆也还有很大的迭代空间。

cua 领域，cli 和gui并不冲突，两者应该会长期共存，cli 在有对应基建的时候更高效，gui 在基建不完备或商业原因不开放时保障通用性，gui还能比。整个互联网上，完备的 cli 基建不是一天建成的，但现代互联网是以人为中心的，是 gui 的， gui 会在挺长的一个时间窗口内都非常有价值

其实对于基座团队来说， gui 还有一层特殊的价值，竞争优势价值。

当 cli 基建还远远没有完备的当下，gui 能力强的基模，能够完成的任务场景、种类会大幅增加，这会让模型相比没有 gui 能力或 gui能力比较弱的基模有很大的竞争优势。

大部分干活的时候，大家都会选最能把活干好的模型，所以 Claude 那么受欢迎，除非有能力过了基础门槛又足够便宜的模型来竞争

（免费是另外一回事，会扭曲供需） anthropic 还是厉害，生产力场景，无论是 code，还是 cua，都做的非常早，现在飞轮转起来，优势非常明显

至少在vision成本降低下来之前，我们还是要加快CLI基建。

至于DeepSeekOCR之类的叙事，其实我个人不是觉得很make sense。至少目前没人会把code截图给vlm看了吧

### （2）Think With Image的存在主义危机（写的好乱）

这玩意感觉又废卡又tricky，前一段时间一堆人讨论过程里面image到底有没有用之后就没追更了

生成帮助理解跟这个差不多。遇到的问题也是都找不到task。 能做好的不一定非要图片，真ood发现了带着图片也做不好

即使不gen image，只是去调用tool渲染image再进行perception，好像能看懂的还是比较有限的，并且后续他也不是很知道怎么去改，或者越改越糟糕。 chart这些应该算是vision languge pair里面比较多的吧，其他task我就更不敢想了。稍微long horizon的似乎都做的不是很好

AI作图也需要辅助线。 网友想用AI生成男女同样身高的合照，结果得到女矮男高的照片，问题出在哪？该如何修正？thinking with image。 另一个思路是先生成俩一样高的男的，再把其中一个男的性转成女的。 也是相当于用image edit的context先验去压制data刻在weight里的先验



## Vision Centric Pretraining对了吗？

## 我们应该怎么追求表征？



## 多模态的柏拉图假说易于实现吗？



## 空间智能对了吗？



## 世界模型的边界在哪里？



## WAM需要想象吗？



## Vision Community未来可能需要什么？



## Vision之外

### （1）Ego和Taste还重要吗

我其实一直以来认为，在当下这个时代，对于新人而言，拥有好的taste和ego，或者说有自己的想法，可能是一件坏事。

目前只要你想要做AI这个领域，保研或者申请PhD，如果稍微打听下，本科生都知道要在大一大二就开始进组，然后开始发论文，而且现在到了大三有1-2篇A会一作的学生已经不在少数了，这放到3-4年前完全不敢想象。

并且现在，尤其是在国内，我们会发现很多校内课题组，好像越来越像企业管理架构了，做很多项目都是集团军作战，流水线产出，很难遇到培养新人的机会，但是资源却并没有对标企业。与之相对的是企业，他们资源丰富，但并不承担培养新人的责任。那新人谁来培养呢？我想了很久并没有得到答案。

同时伴随着各种外部因素，学生各种压力越来越大，也越来越恐惧自己无法竞争，于是我们会发现这么一类事情：本科生/硕士生发文章越来越多、越来最早，顶会数量越来越膨胀。但同时由于LLM时代重资产化，学术界的资源越来越不够做实验，所以大家的方向高度集中在那么几个所谓“好发文章”的方向。

这样主题的高度集中，又导致所有的candidate几乎都是在少数几个赛道竞争，然后个体简历之间越来越没有区别。但是大部分学生并没有论文/实习之外的一些东西，也就是所谓的connection，所以大家又开始比数量，刷论文数量，集邮式实习，但是人的精力终究有限，这些看似光鲜亮丽的数量里，有多少是自己沉淀的呢？又或者说，有多少工作是有taste的呢？

我们看到太多占坑式工作，在新概念上先做一个baseline，但是不做又不行，后面的人都得follow你；我们看到太多Benchmark和Survey，Benchmark作为能力测试自然非常重要，但是不妨碍绝大多数Benchmark都不能反映真实问题；我们看到太多人为了novel而novel，最后做出来一些非常猎奇的作品。

诸如此类原因，我们会发现文章越来越多，但是同质化越来越严重，令人excited的工作越来越少，我之前很热衷于看文章，但现在发现我4个月不看好像也没关系，基本没有进展，有些新东西反而非常猎奇。

我已经开始怀疑，至少在Vision这个领域，还剩下多少foundation research？至少我认为这少数foundation的work，几乎都是来源于LLM那边的工程迁移，实际上Vision本身几乎没有什么很exciting的新东西了。

同时我们会发现，在scaling up横行的时代，我们确实需要考虑setting的合理性。我其实听到很多说法是，“不能scale的method就不是真科研”，我是反对的；但是你如果要做一个method，尤其是热门方向，你确实应该claim自己的setting，因为这一套大概率在large scale上不work，甚至不同scale上会有完全不同的结论，还涉及到有没有well trained。

种种因素考虑完，甚至做完实验发现，其实几乎没有什么setting是能经得起推敲的，method严谨来看不也work，大部分收益来源于数据，method不掉点只能包装下发文章，反正架构也没啥好改的，那为啥不直接做benchmark造数据得了？

我相信可能真正做过一点research的人都会感到depressed。甚至很多时候我们会发现，你有自己的Ego，有想法去做一些尝试，兴高采烈地做完。但是后面发现，业界早就试过你的做法，并且得到了否定的结论。他们没发出来，但你的文章只是业界失败的边角料，并且业界验证的时间是你的十分之一，那我们就会陷入某种虚无主义。

与此同时，那些被你评价为没有Ego和Taste的人，他们已经按部就班发了很多文章，申请到了PhD，找到了实习，反正业界也不需要什么新范式，而你却看起来一事无成，甚至文章都发不出去。

大家都知道现在paper没用，你做的东西很可能已经被做过，你的sota仅限于1周内，你的文章投出去也因为热点消失而无人问津，但目前的评价体系还是要paper。

如果大家都知道一个很大的东西很久的未来会实现，但是当时完全不可能实现，并且不会依赖于任何一个人的突破，而有人却在它实现之后，反过头来说“我是对的”，然后拿走了credit，这种行为真的值得被欣赏吗？这算是坚持吗？他们确实也可以说是预料到了未来发展，那是他们research taste够好吗？我很难评价。

所以我现在觉得在AI这个热门行业，普通学生在成名前，理想主义可能没有什么生存空间，可能也不太应该有长期主义，也不应该有太强的Ego和Taste，大家得先活下去，才有资格讨论。我现在推荐学弟学妹，先发几篇，追逐热门方向，大哥说什么你就做什么，保障生存，在senior眼中“靠谱”比“有想法”更重要。你不follow，并且你也没有背书的话，你大概率就是“囚徒博弈”中输的最惨的那一类。

没有资源、背书、paper buffer 的 taste，过早暴露你的taste和ego，是风险，很容易被系统惩罚。当前评价体系并不奖励“判断力”本身，它更奖励可见产出、可验证履历和执行稳定性，毕竟这个行业在某种意义上稳定后，不需要评论家。我对这种现象感到非常悲伤，我相信其实也没有热爱research的同学愿意看到或者参与，但是可能实在没有太多选择的余地。

当然，换个角度看，一个ego且taste足够好的人完全可以自信到不在意这个东西重不重要，如果换一个评价体系，可能我们可以得到完全相反的结论，我们从来不想做机器，如果没有taste和ego，那我们和机器有什么区别呢？即使没有世俗意义上的顶尖taste/ago，或者成功学的成绩，也依然是按自己希冀的方式过生活/做研究，本身就是一种幸福。而且现在看起来可能天方夜谭的一些idea，可能大家觉得它未来也不可能实现，有没有可能真的普及呢？我其实非常佩服一些能自洽的朋友，至少比我每日内耗好太多了。

### （2）坚守学界还是投奔业界

其实25-26年以来，我基本听到的都是不利于学界Research的消息。一方面是，至少在北美，PhD quit/Master out/三年毕业然后光速加入业界，或者是Professor on leave去创业/加入Frontier Lab，这种事情已经屡见不鲜了，甚至愈演愈烈。我认识的几乎所有和LLM相关领域的US PhD，都在考虑去业界，学位也不要了，然后没入学PhD的也有很多放弃了offer，选择直接本科/硕士直接进入国内外的frontier lab。

我之前也曾经有过一些坚守偶像，比如3DV的或者Vision Centric的，我发现他们当中目前混的最好的，和转行做LLM/MLLM/Video Gen/Robotics的速度成正比，然后也是光速加入业界。感觉现在但凡是个PhD，只要稍微和LLM沾点边的，都要把quit/ms out/on leave严肃纳入考虑。这放到3年前是非常难以想象的事情，我希望我未来可能申请的时候，还能剩下领域内的Professor在坚守学界。

2026年感觉是非常疯狂的一年，如果让我们功利一点数大包，国内phd给到2-3M rmb似乎已经不罕见，美国则更加疯狂，甚至还有TBD这种average 10M dollars往上的存在，winners get all。同时目前的PhD申请，基本上人人都知道，没有特别强conn的，申请北美几乎Bar要等于往年PhD毕业的水平，现在的很多本科生，已经bg恐怖到了匪夷所思的地步；而有conn的，也基本上专属于某些学校甚至是特色班。

但与此同时，几乎所有人都在说，至少在LLM，可能今年就是上车的最后一年，北美的NG已经开始因为Frontier Lab要上市而很难找到一个position了。 并且现在大家可能慢慢发现，好像各个Frontier Lab的技术栈其实都差不多，没有人手握什么绝对优势技术，大家的架构好像来来回回就是那么几样，传统意义上的算法似乎并不需要创新，甚至新算法可能对于整个系统会更糟糕。

能不能做好模型，技术上的关键可能更在于数据和Infra，人的层面看则是组织架构与尽可能少的政治内斗。我记得25年以前，大家找实习都是希望找一段“自由探索”的reserach intern，做点好玩的新东西，并且有点看不起一些工程化的所谓“脏活累活”；但是现在大家的风向逐渐转为，“哥，你可以带我洗一遍数据吗，我想深刻领悟下模型需要什么数据”，或者，“哥，你可以带我怎么在large scale上玩通信，写infra吗，我想领悟MoE的调参”。

大家好像不再追求什么新东西，而是争先恐后地，想要在基模组里面占坑：Pretrain优先，不行就尝试Post Train；算法（除infra外）最好，不行就尝试去做infra；如果算法都没得做，那就去做data和benchmark；如果做data benchmark连model都没法access，那还是苟住；实在不行咱们就去业务组找个训模型的地方，重复上面的流程。

结果到最后，我知道有很多人，发现好像哪里做的事情都差不多，哪里的结构都差不多，而且技术上都是已有成熟的，那还读啥书，有机会占坑就先去占着，这好像和我们认知中的算法岗差的有点多啊！估计很多人会怀疑人生，我如果把申请PhD xxx Fellowship的力气拿去找工作，那至少我的paper之类就不是仅存在于4-5年后预期，我可以迅速变现。至少客观来看，大部分人其实并没有什么科研理想，大家可能只是觉得这个好赚钱，读PhD可能上下限高，总是要考虑生活的。

而且现在所有人都在焦虑，Agent这么强了，科研其实有很多都是劳动密集型，当Auto Research 1-2年内成熟了，我们真的还需要人来做科研吗？为什么人的Taste就一定会比Agent好，尤其是Agent现在能接触的context越来越多？当年业界的RS是对标学校的PI的，但是现在找教职以及Tenure压力这么大，PhD也越来越多，谁知道5年后会怎么样呢？现在的RS真的不会步了PI体系的后尘吗？

可能也有人会反驳，那难道不需要新人了吗？但目前情况是，人的费用可能远比算力和API低，当一个实习生可以access到百卡，但是拿着堪堪过1w的工资，电费都可以轻松超过这个数几倍，那到底是人在跑卡，还是卡在跑人？当有的业界组每周API额度每人可以有25w美元，那到底人是Agent，还是人在操控Agent？

如果缺新人，那么市场总会找到办法培养；如果市场不愿意养新人，说明这些新人培养的成本远大于收益。本质上，还是因为训模型本身不需要那么多人，至少远少于市场上的新人。这是个市场供需关系。大家可能都是在风口上飞，而不是自己能力问题。到最后“关车门”的结果就是没有新人了，因为新人根本没有resource，没法做training，哪都去不了。

学界确实不应该，在业界已经almost solved的方向上和业界竞争，因为完全无法竞争。但New Tasks？或者一些没做work的方向？他们本应是academia继续创新的方向。然而, 在今天工业界为 AI 人才开出的巨额薪水下, 有几个人能放弃到手大包去尝试高风险的新方向? 做出的创新的工作, 最终大多也只是去大厂成为机器上的一环。很多PhD的代表作，不少是在业界实习时才做出来的吧，并非是学界。而且业界做不work的事情，尤其涉及scale的话，真的应该交给学界解决吗？

而且学界也很难有足够的资源去解决，更何况如果要资源，又要有reseach机会，那大厂本来就有自己的研究部门，为何一定要在学界做呢？可能有些观点是，学界应该做“新观念”“新路线”，但是这些东西，如果没人为你背书，几乎nobody cares啊？这何尝不是一种privilege呢？

所以我们可能需要一个坚守的理由，目前来看，学界能给我们提供一个“自由”的身份，但是这份“自由”似乎也随着外部的各种因素变得越来越有限了。
