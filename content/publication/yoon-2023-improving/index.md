---
title: Improving Aircraft Trajectory Prediction Accuracy with Over-sampling Technique
authors:
- Seokbin Yoon
- Keumjin Lee
date: '2023-01-01'
publishDate: '2025-03-11T12:40:45.536989Z'
publication_types:
- paper-conference
publication: '*2023 IEEE/AIAA 42nd Digital Avionics Systems Conference (DASC)*'


abstract: Trajectory prediction plays a critical role in air traffic management, enhancing the safety and efficiency of operations. Nevertheless, there is significant room for improvement in prediction accuracy. Efforts to improve prediction accuracy often involve the use of artificial intelligence (AI) and other data-driven techniques, but these methods frequently encounter a significant issue: the training dataset is often insufficient and imbalanced, leading to challenges in achieving accurate modeling. This can result in overfitting and a decrease in prediction accuracy. To mitigate these issues, we adopted a data-centric AI approach to trajectory prediction, with an assertion that a trajectory pattern represented by fewer data points should not be considered less significant for the prediction model. Given the potential safety implications of incorrect predictions in air traffic operations, it is important to develop a robust prediction model with consistent performance. Our approach involves identifying trajectory patterns by clustering with a Gaussian mixture model (GMM) and augmenting an imbalanced training data set using the synthetic minority over-sampling technique (SMOTE). A long short-term memory (LSTM) network was trained with the over-sampled training data set. The performance of the proposed method is demonstrated using real air traffic data and compared to a model trained with the original training dataset.
# Summary. An optional shortened abstract.
summary:

tags:
  - Aircraft Trajectory Dataset Augmentation
  - Long Short-Term Memory
---