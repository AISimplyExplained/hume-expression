export const lessonContent = {
  "Applied Transformer Architecture": `
# Applied Transformer Architecture

## Introduction
Transformers have revolutionized the field of natural language processing and beyond. Let's explore their architecture in detail.

## Key Components
1. **Self-Attention Mechanism**
   - Allows the model to weigh the importance of different words in the input
   - Enables parallel processing of input sequences

Here's a simple Python implementation of self-attention:

\`\`\`python
import numpy as np

def self_attention(query, key, value):
    # Compute attention scores
    scores = np.dot(query, key.T) / np.sqrt(key.shape[1])
    
    # Apply softmax to get attention weights
    weights = np.exp(scores) / np.sum(np.exp(scores), axis=1, keepdims=True)
    
    # Compute weighted sum of values
    output = np.dot(weights, value)
    
    return output

# Example usage
query = np.random.randn(1, 64)
key = np.random.randn(10, 64)
value = np.random.randn(10, 64)

attention_output = self_attention(query, key, value)
print(attention_output.shape)  # Output: (1, 64)
\`\`\`

2. **Multi-Head Attention**
   - Multiple attention mechanisms run in parallel
   - Captures different types of relationships in the data

Here's how you might implement multi-head attention:

\`\`\`python
def multi_head_attention(query, key, value, num_heads):
    head_dim = query.shape[1] // num_heads
    
    # Split input for each head
    queries = np.split(query, num_heads, axis=1)
    keys = np.split(key, num_heads, axis=1)
    values = np.split(value, num_heads, axis=1)
    
    # Compute attention for each head
    head_outputs = [self_attention(q, k, v) for q, k, v in zip(queries, keys, values)]
    
    # Concatenate head outputs
    return np.concatenate(head_outputs, axis=1)

# Example usage
query = np.random.randn(1, 256)
key = np.random.randn(10, 256)
value = np.random.randn(10, 256)

multi_head_output = multi_head_attention(query, key, value, num_heads=4)
print(multi_head_output.shape)  # Output: (1, 256)
\`\`\`

3. **Feedforward Neural Networks**
   - Processes the output of the attention layer
   - Introduces non-linearity into the model

## Advantages
- Handles long-range dependencies effectively
- Parallelizable, leading to faster training
- Versatile, applicable to various tasks beyond NLP

## Conclusion
Understanding the Transformer architecture is crucial for working with modern AI models like GPT and BERT.
  `,
  "Transformers vs GANs": `
# Transformers vs GANs

## Introduction
While both Transformers and GANs have revolutionized AI, they serve different purposes and have distinct architectures.

## Transformers
- Primarily used for sequence-to-sequence tasks
- Excel in natural language processing
- Use self-attention mechanisms

Here's a basic outline of a Transformer in PyTorch:

\`\`\`python
import torch
import torch.nn as nn

class Transformer(nn.Module):
    def __init__(self, d_model, nhead, num_encoder_layers, num_decoder_layers):
        super(Transformer, self).__init__()
        self.transformer = nn.Transformer(
            d_model=d_model,
            nhead=nhead,
            num_encoder_layers=num_encoder_layers,
            num_decoder_layers=num_decoder_layers
        )
    
    def forward(self, src, tgt):
        return self.transformer(src, tgt)

# Example usage
model = Transformer(d_model=512, nhead=8, num_encoder_layers=6, num_decoder_layers=6)
src = torch.rand(10, 32, 512)  # (seq_len, batch_size, d_model)
tgt = torch.rand(20, 32, 512)
out = model(src, tgt)
print(out.shape)  # Output: torch.Size([20, 32, 512])
\`\`\`

## GANs (Generative Adversarial Networks)
- Used for generating new data
- Consist of a generator and a discriminator
- Excel in image generation and style transfer

Here's a basic outline of a GAN in PyTorch:

\`\`\`python
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, latent_dim, img_shape):
        super(Generator, self).__init__()
        self.model = nn.Sequential(
            nn.Linear(latent_dim, 128),
            nn.LeakyReLU(0.2),
            nn.Linear(128, 256),
            nn.BatchNorm1d(256),
            nn.LeakyReLU(0.2),
            nn.Linear(256, img_shape),
            nn.Tanh()
        )

    def forward(self, z):
        img = self.model(z)
        return img

class Discriminator(nn.Module):
    def __init__(self, img_shape):
        super(Discriminator, self).__init__()
        self.model = nn.Sequential(
            nn.Linear(img_shape, 128),
            nn.LeakyReLU(0.2),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

    def forward(self, img):
        validity = self.model(img)
        return validity

# Example usage
latent_dim = 100
img_shape = 784  # 28x28 flattened
generator = Generator(latent_dim, img_shape)
discriminator = Discriminator(img_shape)

z = torch.randn(64, latent_dim)
generated_imgs = generator(z)
validity = discriminator(generated_imgs)
\`\`\`

## Key Differences
1. **Purpose**: Transformers for understanding and generating sequences, GANs for creating new data
2. **Architecture**: Transformers use attention, GANs use adversarial training
3. **Applications**: Transformers in NLP, GANs in computer vision (though there's overlap)

## Conclusion
Both architectures have their strengths and are pushing the boundaries of AI in different domains.
  `,
  // Add content for other lessons here
};