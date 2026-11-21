[📄 Download PDF CV](/cv.pdf)

## Education

**Arizona State University**, Ph.D. in Data Science, Analytics & Engineering, *Expected Feb 2027*
- GPA 4.00/4.00 · Advisor: Dr. Douglas C. Montgomery
- Thesis: *Unsupervised knowledge discovery for process & quality enhancement in Directed Energy Deposition*

**Tongji University**, M.Sc., Shanghai, *2022*
- GPA 4.00/4.00

**Dalian University of Technology**, B.E., Dalian, *2019*
- GPA 3.63/4.00 · Exchange: Technical University of Munich, 2018

## Experience

**Research Intern**, DAMO Academy, Alibaba Group · *Jun 2026 – Sep 2026*
- Built Rubric Talos, an MCP tool that calls closed-source LLM APIs to draft evaluation rubrics, adopted by the company's domain experts.
- Developed a teacher-in-the-loop co-evolving rubric-as-reward framework for long-form LLM RL.

**Research & Teaching Assistant**, SCAI, Arizona State University · *Aug 2022 – Present*
- Led AI-generated video detection and multimodal manufacturing anomaly detection projects.
- TA for graduate courses IEE 572 Design of Engineering Experiments, IEE 579 Time Series Analysis and Forecasting, and IEE 578 Regression Analysis since Fall 2024, supporting ~120 students per semester.

## Key Projects

**Teacher-in-the-Loop Co-Evolving Rubrics as Rewards** · DAMO Academy · *Jun 2026 – Sep 2026*
- Identified *discriminative collapse* in rubric rewards: under GRPO with a frozen teacher rubric, Qwen3-4B's expert-rubric quality fell monotonically (0.055→0.023), yet expert rubrics still separated 79% of collapsed prompts — signal degradation, not reward hacking.
- Designed a co-evolving framework: detect collapsed prompts via within-group reward variance, have the teacher rewrite contrastive rubrics there, and retrain a LoRA-distilled generator each round.
- Built Rubric Talos (0.68 Pearson with expert rubrics, 0.97 cross-vendor judge agreement); its rewards raised independently anchored quality by 0.127.

**AI-generated Video Detection** · SCAI, ASU · *Apr 2026 – Present*
- Built video processing pipelines for a 2.4 TB+ dataset with OpenCV and FFmpeg; curating a large-scale benchmark targeting SOTA diffusion-based generators.
- Developing a detector fusing pixel-level frequency artifacts, feature-space temporal dynamics, and spatial forensic attention, plus a reasoning VLM trained with SFT and RL using evolving rubrics as rewards.

**Anomaly Detection & Defect Classification in Manufacturing** · SCAI, ASU & Intel Semiconductor Challenge · *Jan 2023 – Present*
- Multimodal ML pipeline integrating acoustic emission, process logs, and CT imaging; multi-task GMM with structured regularization for root-cause diagnostics.
- Incremental-SVD anomaly detection workflow cutting real-time monitoring runtime by 80%.
- Semiconductor defect classifier (frozen DINOv2, KMeans routing, 12 per-cluster heads) with confidence-aware human-in-the-loop review: 84.5% accuracy (+4.2% over best baseline), AUROC 0.986 at <5% FPR.

## Skills

- **Languages:** Python, C/C++, Java, SQL, R
- **AI/ML & Data:** PyTorch, TensorFlow, Scikit-learn, Hugging Face Transformers, Pandas, NumPy
- **Specialties:** LLM Evaluation, Rubrics, Deep Research, Post-training, Model Optimization, Computer Vision, Video Processing
- **Infra & Tools:** CUDA, Linux, Git, CI/CD, HPC Clusters, OpenCV, FFmpeg, MATLAB, SAS, JMP

## Fellowships & Awards

- Graduate College Completion Fellowship, 2026
- Douglas C. Montgomery Fellowship, 2024–25
- SCAI Doctoral Fellowship, 2024
