# schrodinger

## Introduction

[Schrödinger's cat](https://en.wikipedia.org/wiki/Schr%C3%B6dinger%27s_cat) is a thought experiment devised by Austrian physicist Erwin Schrödinger in 1935. This experiment propose to introduce a cat inside a close box with a probabilistic radiactive device that going to cause the cat's death without knowing the time of its death. Only if someone opens the box, then they be able to know if cat is dead or alive. This micro-library does not aim to clarify anything about this paradoxical quantum experiment.

Conversely it provides a class that build instances with undetermined value inside. This value is only determined if the user gets the value or force the value setting it. Once the user know the value, this value is unmodifiable. This library also provides a set of errors to prevent forcing the value if it has been already determined.